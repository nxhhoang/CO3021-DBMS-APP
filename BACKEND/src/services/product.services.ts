import { ObjectId, Filter } from 'mongodb'
import { PRODUCT_MESSAGES } from '~/constants/messages'
import Product from '~/models/schemas/Product.schema'
import mockInventory from '~/models/data/inventory.data'
import { CreateProductReqBody, SearchProductQuery, UpdateProductReqBody } from '~/models/requests/Product.requests'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { getMongoDB } from '~/utils/mongodb'
import Category from '~/models/schemas/Category.schema'

class ProductService {
  private get collection() {
    return getMongoDB().collection<Product>('products')
  }

  // ── Queries ───────────────────────────────────────────────────────────────────

  async searchProducts(query: SearchProductQuery) {
    const page = Math.max(1, parseInt(query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 10))
    const skip = (page - 1) * limit

    const matchQuery: Filter<Product> = { is_active: true }

    // If category slug is provided, we must find the category ID first
    if (query.category) {
      const cat = await getMongoDB().collection<Category>('categories').findOne({ slug: query.category })
      if (!cat) {
        return {
          products: [],
          pagination: {
            totalItems: 0, itemCount: 0, itemsPerPage: limit, totalPages: 0,
            currentPage: page, nextPage: null, hasPrevPage: false, hasNextPage: false
          }
        }
      }
      matchQuery.categoryId = cat._id
    }

    if (query.keyword) {
      matchQuery.$or = [
        { name: { $regex: query.keyword, $options: 'i' } },
        { description: { $regex: query.keyword, $options: 'i' } }
      ]
    }

    if (query.priceMin !== undefined || query.priceMax !== undefined) {
      matchQuery.base_price = {}
      if (query.priceMin !== undefined) matchQuery.base_price.$gte = parseFloat(query.priceMin as string)
      if (query.priceMax !== undefined) matchQuery.base_price.$lte = parseFloat(query.priceMax as string)
    }

    if (query.attrs && typeof query.attrs === 'object') {
      for (const [key, value] of Object.entries(query.attrs as Record<string, string>)) {
        matchQuery[`attributes.${key}`] = value
      }
    }

    const sortObject: any = {}
    if (query.sort) {
      const sortMap: Record<string, any> = {
        priceASC: { base_price: 1 },
        priceDESC: { base_price: -1 },
        ratingASC: { avg_rating: 1 },
        ratingDESC: { avg_rating: -1 },
        soldASC: { total_sold: 1 },
        soldDESC: { total_sold: -1 }
      }
      Object.assign(sortObject, sortMap[query.sort as string] || { total_sold: -1 })
    } else {
      sortObject.total_sold = -1
    }

    const total = await this.collection.countDocuments(matchQuery)
    const results = await this.collection.find(matchQuery).sort(sortObject).skip(skip).limit(limit).toArray()

    // Populate category info
    const categoryIds = [...new Set(results.map(p => p.categoryId))]
    const categories = await getMongoDB().collection<Category>('categories')
      .find({ _id: { $in: categoryIds } }).toArray()

    const mappedResults = results.map(p => {
      const cat = categories.find(c => c._id.toHexString() === p.categoryId.toHexString())
      const { categoryId, ...rest } = p as any
      return {
        ...rest,
        category: cat ? { _id: cat._id.toHexString(), name: cat.name, slug: cat.slug } : null
      }
    })

    const totalPages = Math.ceil(total / limit)
    return {
      products: mappedResults,
      pagination: {
        totalItems: total,
        itemCount: mappedResults.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
        nextPage: page < totalPages ? page + 1 : null,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages
      }
    }
  }

  async getProductById(id: string) {
    const product = await this.collection.findOne({ _id: new ObjectId(id), is_active: true })
    if (!product) {
      throw new ErrorWithStatus({
        message: PRODUCT_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const cat = await getMongoDB().collection<Category>('categories').findOne({ _id: product.categoryId })
    const { categoryId, ...rest } = product as any
    const mappedProduct = {
      ...rest,
      category: cat ? { _id: cat._id.toHexString(), name: cat.name, slug: cat.slug } : null
    }

    // Hybrid: get inventory from PostgreSQL mock (still keeping this part as it uses an external mock array intentionally for now until BE1 migration)
    const inventory = mockInventory
      .filter((inv) => inv.product_id === id)
      .map((inv) => ({ sku: inv.sku, stockQuantity: inv.stock_quantity, sku_price: inv.sku_price }))

    return { ...mappedProduct, inventory }
  }

  // ── Admin mutations ───────────────────────────────────────────────────────────

  async createProduct(body: CreateProductReqBody) {
    const newProduct = new Product({
      name: body.name,
      slug: body.slug,
      categoryId: new ObjectId(body.categoryID as string),
      base_price: body.basePrice,
      description: body.description,
      images: body.images,
      attributes: body.attributes || {}
    })

    const result = await this.collection.insertOne(newProduct)
    return { _id: result.insertedId }
  }

  async updateProduct(id: string, body: UpdateProductReqBody) {
    const updateData: Partial<Product> = {
      updated_at: new Date()
    }

    if (body.name !== undefined) updateData.name = body.name
    if (body.categoryID !== undefined) updateData.categoryId = new ObjectId(body.categoryID as string)
    if (body.basePrice !== undefined) updateData.base_price = body.basePrice
    if (body.description !== undefined) updateData.description = body.description
    if (body.images !== undefined) updateData.images = body.images
    if (body.attributes !== undefined) updateData.attributes = body.attributes

    const updated = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    if (!updated) {
      throw new ErrorWithStatus({
        message: PRODUCT_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return { _id: updated._id, name: updated.name, base_price: updated.base_price }
  }

  async softDeleteProduct(id: string) {
    const updated = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { is_active: false, updated_at: new Date() } },
      { returnDocument: 'after' }
    )

    if (!updated) {
      throw new ErrorWithStatus({
        message: PRODUCT_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return { _id: updated._id, isActive: false }
  }

  // ── Computed update (called by review service) ────────────────────────────────

  async updateProductRating(productId: string, avgRating: number, totalReviews: number) {
    await this.collection.updateOne(
      { _id: new ObjectId(productId) },
      { $set: { avg_rating: avgRating, total_reviews: totalReviews, updated_at: new Date() } }
    )
  }

  // ── Called by order service (BE1) ─────────────────────────────────────────────

  async updateProductSoldCount(productId: string, quantityDelta: number) {
    await this.collection.updateOne(
      { _id: new ObjectId(productId) },
      { $inc: { total_sold: quantityDelta }, $set: { updated_at: new Date() } }
    )
  }

  // ── Internal helpers ──────────────────────────────────────────────────────────

  async getProductByIdSync(id: string): Promise<Product | null> {
    return await this.collection.findOne({ _id: new ObjectId(id) })
  }
}

const productService = new ProductService()
export default productService

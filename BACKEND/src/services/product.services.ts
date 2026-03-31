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

    const matchQuery: Filter<Product> = { isActive: true }

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
      matchQuery.categoryID = cat._id
    }

    if (query.keyword) {
      matchQuery.$or = [
        { name: { $regex: query.keyword, $options: 'i' } },
        { description: { $regex: query.keyword, $options: 'i' } }
      ]
    }

    if (query.priceMin !== undefined || query.priceMax !== undefined) {
      matchQuery.basePrice = {}
      if (query.priceMin !== undefined) matchQuery.basePrice.$gte = parseFloat(query.priceMin as string)
      if (query.priceMax !== undefined) matchQuery.basePrice.$lte = parseFloat(query.priceMax as string)
    }

    if (query.attrs && typeof query.attrs === 'object') {
      for (const [key, value] of Object.entries(query.attrs as Record<string, string>)) {
        matchQuery[`attributes.${key}`] = value
      }
    }

    const sortObject: any = {}
    if (query.sort) {
      const sortMap: Record<string, any> = {
        priceASC: { basePrice: 1 },
        priceDESC: { basePrice: -1 },
        ratingASC: { avgRating: 1 },
        ratingDESC: { avgRating: -1 },
        soldASC: { totalSold: 1 },
        soldDESC: { totalSold: -1 }
      }
      Object.assign(sortObject, sortMap[query.sort as string] || { totalSold: -1 })
    } else {
      sortObject.totalSold = -1
    }

    const total = await this.collection.countDocuments(matchQuery)
    const results = await this.collection.find(matchQuery).sort(sortObject).skip(skip).limit(limit).toArray()

    // Populate category info
    const categoryIDs = [...new Set(results.map(p => p.categoryID))]
    const categories = await getMongoDB().collection<Category>('categories')
      .find({ _id: { $in: categoryIDs } }).toArray()

    const mappedResults = results.map(p => {
      const cat = categories.find(c => c._id.toHexString() === p.categoryID.toHexString())
      const { categoryID, ...rest } = p as any
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
    const product = await this.collection.findOne({ _id: new ObjectId(id), isActive: true })
    if (!product) {
      throw new ErrorWithStatus({
        message: PRODUCT_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const cat = await getMongoDB().collection<Category>('categories').findOne({ _id: product.categoryID })
    const { categoryID, ...rest } = product as any
    const mappedProduct = {
      ...rest,
      category: cat ? { _id: cat._id.toHexString(), name: cat.name, slug: cat.slug } : null
    }

    // Hybrid: get inventory from PostgreSQL mock (still keeping this part as it uses an external mock array intentionally for now until BE1 migration)
    const inventory = mockInventory
      .filter((inv) => inv.productID === id)
      .map((inv) => ({ sku: inv.sku, stockQuantity: inv.stockQuantity, sku_price: inv.skuPrice }))

    return { ...mappedProduct, inventory }
  }

  // ── Admin mutations ───────────────────────────────────────────────────────────

  async createProduct(body: CreateProductReqBody) {
    const newProduct = new Product({
      name: body.name,
      slug: body.slug,
      categoryID: new ObjectId(body.categoryID as string),
      basePrice: body.basePrice,
      description: body.description,
      images: body.images,
      attributes: body.attributes || {}
    })

    const result = await this.collection.insertOne(newProduct)
    return { _id: result.insertedId }
  }

  async updateProduct(id: string, body: UpdateProductReqBody) {
    const updateData: Partial<Product> = {
      updatedAt: new Date()
    }

    if (body.name !== undefined) updateData.name = body.name
    if (body.categoryID !== undefined) updateData.categoryID = new ObjectId(body.categoryID as string)
    if (body.basePrice !== undefined) updateData.basePrice = body.basePrice
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

    return { _id: updated._id, name: updated.name, basePrice: updated.basePrice }
  }

  async softDeleteProduct(id: string) {
    const updated = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { isActive: false, updatedAt: new Date() } },
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
      { $set: { avgRating: avgRating, totalReviews: totalReviews, updatedAt: new Date() } }
    )
  }

  // ── Called by order service (BE1) ─────────────────────────────────────────────

  async updateProductSoldCount(productId: string, quantityDelta: number) {
    await this.collection.updateOne(
      { _id: new ObjectId(productId) },
      { $inc: { totalSold: quantityDelta }, $set: { updatedAt: new Date() } }
    )
  }

  // ── Internal helpers ──────────────────────────────────────────────────────────

  async getProductByIdSync(id: string): Promise<Product | null> {
    return await this.collection.findOne({ _id: new ObjectId(id) })
  }
}

const productService = new ProductService()
export default productService

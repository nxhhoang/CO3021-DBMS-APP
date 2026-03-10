import { ObjectId } from 'mongodb'
import { PRODUCT_MESSAGES, INVENTORY_MESSAGES } from '~/constants/messages'
import Product from '~/models/schemas/Product.schema'
import mockProducts from '~/models/data/products.data'
import mockInventory from '~/models/data/inventory.data'
import { CreateProductReqBody, SearchProductQuery, UpdateProductReqBody } from '~/models/requests/Product.requests'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

class ProductService {
  // In-memory stores — thay bằng MongoDB collection và PostgreSQL khi kết nối thật
  private products: Product[] = mockProducts

  // ── Helpers ──────────────────────────────────────────────────────────────────

  private buildFilter(query: SearchProductQuery): (product: Product) => boolean {
    return (product: Product) => {
      if (!product.is_active) return false

      if (query.keyword) {
        const kw = query.keyword.toLowerCase()
        if (!product.name.toLowerCase().includes(kw) && !product.description.toLowerCase().includes(kw)) {
          return false
        }
      }

      if (query.categoryId) {
        if (!ObjectId.isValid(query.categoryId)) return false
        if (product.categoryId.toHexString() !== query.categoryId) return false
      }

      if (query.price_min !== undefined) {
        const min = parseFloat(query.price_min as string)
        if (!isNaN(min) && product.base_price < min) return false
      }

      if (query.price_max !== undefined) {
        const max = parseFloat(query.price_max as string)
        if (!isNaN(max) && product.base_price > max) return false
      }

      // Dynamic attribute filters — e.g. attrs[ram]=16GB
      if (query.attrs && typeof query.attrs === 'object') {
        for (const [key, value] of Object.entries(query.attrs as Record<string, string>)) {
          if (product.attributes[key] !== value) return false
        }
      }

      return true
    }
  }

  // ── Queries ───────────────────────────────────────────────────────────────────

  async searchProducts(query: SearchProductQuery) {
    const page = Math.max(1, parseInt(query.page as string) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 20))
    const skip = (page - 1) * limit

    const filter = this.buildFilter(query)
    const filtered = this.products.filter(filter)
    const total = filtered.length
    const results = filtered.slice(skip, skip + limit)

    return {
      products: results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async getProductById(id: string) {
    const product = this.products.find((p) => p._id.toHexString() === id && p.is_active)
    if (!product) {
      throw new ErrorWithStatus({
        message: PRODUCT_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    // Hybrid: get inventory from PostgreSQL mock
    const inventory = mockInventory
      .filter((inv) => inv.product_id === id)
      .map((inv) => ({ sku: inv.sku, stockQuantity: inv.stock_quantity }))

    return { ...product, inventory }
  }

  // ── Admin mutations ───────────────────────────────────────────────────────────

  async createProduct(body: CreateProductReqBody) {
    const newProduct = new Product({
      name: body.name,
      categoryId: new ObjectId(body.categoryId),
      base_price: body.base_price,
      description: body.description,
      images: body.images,
      attributes: body.attributes || {}
    })

    this.products.push(newProduct)
    return { _id: newProduct._id }
  }

  async updateProduct(id: string, body: UpdateProductReqBody) {
    const index = this.products.findIndex((p) => p._id.toHexString() === id)
    if (index === -1) {
      throw new ErrorWithStatus({
        message: PRODUCT_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const existing = this.products[index]
    const updated = new Product({
      _id: existing._id,
      name: body.name ?? existing.name,
      slug: existing.slug,
      categoryId: body.categoryId ? new ObjectId(body.categoryId) : existing.categoryId,
      base_price: body.base_price ?? existing.base_price,
      description: body.description ?? existing.description,
      images: body.images ?? existing.images,
      attributes: body.attributes ?? existing.attributes,
      avg_rating: existing.avg_rating,
      total_reviews: existing.total_reviews,
      total_sold: existing.total_sold,
      is_active: existing.is_active,
      created_at: existing.created_at,
      updated_at: new Date()
    })

    this.products[index] = updated
    return { _id: updated._id, name: updated.name, base_price: updated.base_price }
  }

  async softDeleteProduct(id: string) {
    const index = this.products.findIndex((p) => p._id.toHexString() === id)
    if (index === -1) {
      throw new ErrorWithStatus({
        message: PRODUCT_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    this.products[index].is_active = false
    this.products[index].updated_at = new Date()
    return { _id: this.products[index]._id, isActive: false }
  }

  // ── Computed update (called by review service) ────────────────────────────────

  updateProductRating(productId: string, avgRating: number, totalReviews: number) {
    const index = this.products.findIndex((p) => p._id.toHexString() === productId)
    if (index !== -1) {
      this.products[index].avg_rating = avgRating
      this.products[index].total_reviews = totalReviews
      this.products[index].updated_at = new Date()
    }
  }

  // ── Called by order service (BE1) ─────────────────────────────────────────────

  updateProductSoldCount(productId: string, quantityDelta: number) {
    const index = this.products.findIndex((p) => p._id.toHexString() === productId)
    if (index !== -1) {
      this.products[index].total_sold = (this.products[index].total_sold || 0) + quantityDelta
      this.products[index].updated_at = new Date()
    }
  }

  // ── Internal helpers ──────────────────────────────────────────────────────────

  getProductByIdSync(id: string): Product | undefined {
    return this.products.find((p) => p._id.toHexString() === id)
  }
}

const productService = new ProductService()
export default productService

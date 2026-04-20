import { ObjectId } from 'mongodb'

interface ProductType {
  _id?: ObjectId
  name: string
  slug?: string
  categoryID: ObjectId
  basePrice: number
  description?: string
  images?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes?: Record<string, any>
  avgRating?: number
  totalReviews?: number
  totalSold?: number
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export default class Product {
  _id: ObjectId
  name: string
  slug: string
  categoryID: ObjectId
  basePrice: number
  description: string
  images: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: Record<string, any>
  avgRating: number
  totalReviews: number
  totalSold: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date

  constructor(product: ProductType) {
    const date = new Date()
    this._id = product._id || new ObjectId()
    this.name = product.name
    this.slug = product.slug || ''
    this.categoryID = product.categoryID
    this.basePrice = product.basePrice
    this.description = product.description || ''
    this.images = product.images || []
    this.attributes = product.attributes || {}
    this.avgRating = product.avgRating ?? 0
    this.totalReviews = product.totalReviews ?? 0
    this.totalSold = product.totalSold ?? 0
    this.isActive = product.isActive !== undefined ? product.isActive : true
    this.createdAt = product.createdAt || date
    this.updatedAt = product.updatedAt || date
  }
}

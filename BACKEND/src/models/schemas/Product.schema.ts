import { ObjectId } from 'mongodb'

interface ProductType {
  _id?: ObjectId
  name: string
  slug?: string
  categoryId: ObjectId
  base_price: number
  description?: string
  images?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes?: Record<string, any>
  avg_rating?: number
  total_reviews?: number
  total_sold?: number
  is_active?: boolean
  created_at?: Date
  updated_at?: Date
}

export default class Product {
  _id: ObjectId
  name: string
  slug: string
  categoryId: ObjectId
  base_price: number
  description: string
  images: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: Record<string, any>
  avg_rating: number
  total_reviews: number
  total_sold: number
  is_active: boolean
  created_at: Date
  updated_at: Date

  constructor(product: ProductType) {
    const date = new Date()
    this._id = product._id || new ObjectId()
    this.name = product.name
    this.slug = product.slug || ''
    this.categoryId = product.categoryId
    this.base_price = product.base_price
    this.description = product.description || ''
    this.images = product.images || []
    this.attributes = product.attributes || {}
    this.avg_rating = product.avg_rating ?? 0
    this.total_reviews = product.total_reviews ?? 0
    this.total_sold = product.total_sold ?? 0
    this.is_active = product.is_active !== undefined ? product.is_active : true
    this.created_at = product.created_at || date
    this.updated_at = product.updated_at || date
  }
}

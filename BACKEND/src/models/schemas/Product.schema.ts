import { ObjectId } from 'mongodb'

interface ProductType {
  _id?: ObjectId
  name: string
  slug?: string
  category: string
  base_price: number
  description?: string
  images?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes?: Record<string, any>
  is_active?: boolean
  created_at?: Date
  updated_at?: Date
}

export default class Product {
  _id: ObjectId
  name: string
  slug: string
  category: string
  base_price: number
  description: string
  images: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: Record<string, any>
  is_active: boolean
  created_at: Date
  updated_at: Date

  constructor(product: ProductType) {
    const date = new Date()
    this._id = product._id || new ObjectId()
    this.name = product.name
    this.slug = product.slug || ''
    this.category = product.category
    this.base_price = product.base_price
    this.description = product.description || ''
    this.images = product.images || []
    this.attributes = product.attributes || {}
    this.is_active = product.is_active !== undefined ? product.is_active : true
    this.created_at = product.created_at || date
    this.updated_at = product.updated_at || date
  }
}

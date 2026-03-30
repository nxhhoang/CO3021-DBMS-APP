import { ObjectId } from 'mongodb'

interface SKUType {
  _id?: ObjectId
  sku: string
  sku_price: number
  product_id: ObjectId
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes?: Record<string, any>
  created_at?: Date
  updated_at?: Date
}

export default class SKU {
  _id: ObjectId
  sku: string
  sku_price: number
  product_id: ObjectId
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: Record<string, any>
  created_at: Date
  updated_at: Date

  constructor(sku: SKUType) {
    const date = new Date()
    this._id = sku._id || new ObjectId()
    this.sku = sku.sku
    this.sku_price = sku.sku_price
    this.product_id = sku.product_id
    this.attributes = sku.attributes || {}
    this.created_at = sku.created_at || date
    this.updated_at = sku.updated_at || date
  }
}

import { ObjectId } from 'mongodb'

interface SKUType {
  _id?: ObjectId
  sku: string
  skuPrice: number
  productID: ObjectId
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes?: Record<string, any>
  createdAt?: Date
  updatedAt?: Date
}

export default class SKU {
  _id: ObjectId
  sku: string
  skuPrice: number
  productID: ObjectId
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: Record<string, any>
  createdAt: Date
  updatedAt: Date

  constructor(sku: SKUType) {
    const date = new Date()
    this._id = sku._id || new ObjectId()
    this.sku = sku.sku
    this.skuPrice = sku.skuPrice
    this.productID = sku.productID
    this.attributes = sku.attributes || {}
    this.createdAt = sku.createdAt || date
    this.updatedAt = sku.updatedAt || date
  }
}

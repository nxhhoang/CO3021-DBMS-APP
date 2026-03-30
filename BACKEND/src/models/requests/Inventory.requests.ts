import { ParamsDictionary } from 'express-serve-static-core'

export interface InventoryReqParams extends ParamsDictionary {
  inventoryId: string
}

export interface ProductInventoryReqParams extends ParamsDictionary {
  productId: string
}

export interface SkuInventoryReqParams extends ParamsDictionary {
  sku: string
}

export interface CreateInventoryReqBody {
  product_id: string
  sku: string
  stock_quantity: number
}

export interface UpdateInventoryReqBody {
  stock_quantity: number
}

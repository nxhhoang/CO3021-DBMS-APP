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
  productID: string
  sku: string
  stockQuantity: number
}

export interface UpdateInventoryReqBody {
  stockQuantity: number
}

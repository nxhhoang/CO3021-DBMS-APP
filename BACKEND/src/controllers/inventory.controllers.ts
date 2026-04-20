import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import inventoryService from '~/services/inventory.services'
import { INVENTORY_MESSAGES } from '~/constants/messages'
import {
  CreateInventoryReqBody,
  UpdateInventoryReqBody,
  InventoryReqParams,
  ProductInventoryReqParams,
  SkuInventoryReqParams
} from '~/models/requests/Inventory.requests'

export const createInventoryController = async (
  req: Request<ParamsDictionary, any, CreateInventoryReqBody>,
  res: Response
) => {
  const result = await inventoryService.createInventory(req.body)
  res.json({
    message: INVENTORY_MESSAGES.CREATE_INVENTORY_SUCCESS,
    result
  })
}

export const updateInventoryQuantityController = async (
  req: Request<InventoryReqParams, any, UpdateInventoryReqBody>,
  res: Response
) => {
  const { inventoryId } = req.params
  const { stockQuantity } = req.body
  const result = await inventoryService.updateInventoryQuantity(inventoryId, stockQuantity)
  res.json({
    message: INVENTORY_MESSAGES.UPDATE_INVENTORY_SUCCESS,
    result
  })
}

export const getInventoriesByProductController = async (
  req: Request<ProductInventoryReqParams>,
  res: Response
) => {
  const { productId } = req.params
  const result = await inventoryService.getInventoriesByProductId(productId)
  res.json({
    message: INVENTORY_MESSAGES.GET_INVENTORY_SUCCESS,
    result
  })
}

export const getInventoriesBySkuController = async (
  req: Request<SkuInventoryReqParams>,
  res: Response
) => {
  const { sku } = req.params
  const result = await inventoryService.getInventoriesBySku(sku)
  res.json({
    message: INVENTORY_MESSAGES.GET_INVENTORY_SUCCESS,
    result
  })
}

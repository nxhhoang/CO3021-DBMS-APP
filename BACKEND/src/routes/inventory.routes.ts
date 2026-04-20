import { Router } from 'express'
import {
  createInventoryController,
  updateInventoryQuantityController,
  getInventoriesByProductController,
  getInventoriesBySkuController
} from '~/controllers/inventory.controllers'
import {
  createInventoryValidator,
  updateInventoryValidator
} from '~/middlewares/inventory.middlewares'
import { accessTokenValidator } from '~/middlewares/sample.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const inventoryRouter = Router()

/**
 * Description: Create a new inventory record for a product/sku variant
 * Path: /admin/inventories
 * Method: POST
 * Body: { productID: string, sku: string, stockQuantity: number }
 */
inventoryRouter.post(
  '/',
  accessTokenValidator,
  createInventoryValidator,
  wrapRequestHandler(createInventoryController)
)

/**
 * Description: Update stock quantity of an existing inventory record
 * Path: /admin/inventories/:inventoryId
 * Method: PUT
 * Body: { stockQuantity: number }
 */
inventoryRouter.put(
  '/:inventoryId',
  accessTokenValidator,
  updateInventoryValidator,
  wrapRequestHandler(updateInventoryQuantityController)
)

/**
 * Description: Get all inventory records across all warehouses for a specific Product
 * Path: /inventories/product/:productId
 * Method: GET
 */
inventoryRouter.get(
  '/product/:productId',
  wrapRequestHandler(getInventoriesByProductController)
)

/**
 * Description: Get inventory records for a specific SKU variation
 * Path: /inventories/sku/:sku
 * Method: GET
 */
inventoryRouter.get(
  '/sku/:sku',
  wrapRequestHandler(getInventoriesBySkuController)
)

export default inventoryRouter

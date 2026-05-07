import { addressHandlers } from './handlers/address.handler'
import { authHandlers } from './handlers/auth.handler'
import { productHandlers } from './handlers/product.handler'
import { userHandlers } from './handlers/user.handler'
import { categoryHandlers } from './handlers/category.handler'
import { cartHandlers } from './handlers/cart.handlers'
import { orderHandlers } from './handlers/order.handlers'
import { inventoryHandlers } from './handlers/inventory.handler'
import { statsHandlers } from './handlers/stats.handler'

export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...addressHandlers,
  ...categoryHandlers,
  ...productHandlers,
  ...cartHandlers,
  ...orderHandlers,
  ...inventoryHandlers,
  ...statsHandlers,
]

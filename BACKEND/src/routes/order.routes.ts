import { Router } from 'express'
import {
  checkoutController,
  getOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
  processPaymentController,
  getRevenueStatsController
} from '~/controllers/order.controllers'
import { accessTokenValidator, verifyRoleMiddleware } from '~/middlewares/auth.middlewares'
import { checkoutValidator, updateOrderStatusValidator } from '~/middlewares/order.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import { UserRole } from '~/constants/enums'

const orderRouter = Router()
const paymentRouter = Router()
const adminRouter = Router()

//  Order Routes

/**
 * POST /api/v1/orders — Checkout (ACID Transaction)
 */
orderRouter.post('/', accessTokenValidator, checkoutValidator, wrapRequestHandler(checkoutController))

/**
 * GET /api/v1/orders — Order history
 */
orderRouter.get('/', accessTokenValidator, wrapRequestHandler(getOrdersController))

/**
 * GET /api/v1/orders/:orderId — Order detail
 */
orderRouter.get('/:orderId', accessTokenValidator, wrapRequestHandler(getOrderByIdController))

//  Payment Routes

/**
 * POST /api/v1/payments/process — Confirm payment
 */
paymentRouter.post('/process', accessTokenValidator, wrapRequestHandler(processPaymentController))

//  Admin Routes (Stats + Order Status)

/**
 * PUT /api/v1/admin/orders/:orderId/status — Update order status
 */
adminRouter.put(
  '/orders/:orderId/status',
  accessTokenValidator,
  verifyRoleMiddleware(UserRole.ADMIN),
  updateOrderStatusValidator,
  wrapRequestHandler(updateOrderStatusController)
)

/**
 * GET /api/v1/admin/stats/revenue?startDate=&endDate=&type=
 */
adminRouter.get(
  '/stats/revenue',
  accessTokenValidator,
  verifyRoleMiddleware(UserRole.ADMIN),
  wrapRequestHandler(getRevenueStatsController)
)

export { orderRouter, paymentRouter, adminRouter }

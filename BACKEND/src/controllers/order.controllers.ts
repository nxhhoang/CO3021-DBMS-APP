import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { ORDER_MESSAGES, PAYMENT_MESSAGES, STAT_MESSAGES } from '~/constants/messages'
import { CheckoutReqBody, OrderReqParams } from '~/models/requests/Order.requests'
import { ProcessPaymentReqBody } from '~/models/requests/Payment.requests'
import { RevenueStatQuery } from '~/models/requests/Stat.requests'
import { OrderStatus } from '~/constants/enums'
import orderService from '~/services/order.services'
import paymentService from '~/services/payment.services'
import statService from '~/services/stat.services'

//  Orders

export const checkoutController = async (req: Request<ParamsDictionary, unknown, CheckoutReqBody>, res: Response) => {
  const userId = req.decoded_authorization!.userId
  const result = await orderService.checkout(userId, req.body)
  res.status(HTTP_STATUS.CREATED).json({ message: ORDER_MESSAGES.CHECKOUT_SUCCESS, data: result })
}

export const getOrdersController = async (req: Request, res: Response) => {
  const userId = req.decoded_authorization!.userId
  const result = await orderService.getOrders(userId)
  res.status(HTTP_STATUS.OK).json({ message: ORDER_MESSAGES.GET_ORDERS_SUCCESS, data: result })
}

export const getOrderByIdController = async (req: Request<OrderReqParams>, res: Response) => {
  const userId = req.decoded_authorization!.userId
  const orderId = parseInt(req.params.orderId)
  const result = await orderService.getOrderById(orderId, userId)
  res.status(HTTP_STATUS.OK).json({ message: ORDER_MESSAGES.GET_ORDER_DETAIL_SUCCESS, data: result })
}

export const updateOrderStatusController = async (req: Request<OrderReqParams>, res: Response) => {
  const orderId = parseInt(req.params.orderId)
  const { status } = req.body as { status: OrderStatus }
  const result = await orderService.updateOrderStatus(orderId, status)
  res.status(HTTP_STATUS.OK).json({ message: ORDER_MESSAGES.UPDATE_ORDER_STATUS_SUCCESS, data: result })
}

//  Payments

export const processPaymentController = async (
  req: Request<ParamsDictionary, unknown, ProcessPaymentReqBody>,
  res: Response
) => {
  const result = await paymentService.processPayment(req.body.orderID, req.body.paymentMethod)
  res.status(HTTP_STATUS.OK).json({ message: PAYMENT_MESSAGES.PROCESS_SUCCESS, data: result })
}

//  Statistics

export const getRevenueStatsController = async (
  req: Request<ParamsDictionary, unknown, unknown, RevenueStatQuery>,
  res: Response
) => {
  const result = await statService.getRevenueStats(req.query)
  res.status(HTTP_STATUS.OK).json({ message: STAT_MESSAGES.GET_REVENUE_SUCCESS, data: result })
}

export const getAllOrdersAdminController = async (req: Request, res: Response) => {
  // Lấy page, limit, search, status và sort từ query string
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const search = req.query.search as string
  const status = req.query.status as string
  const sort = req.query.sort as string

  const result = await orderService.getAllOrdersAdmin(limit, page, search, status, sort)

  res.status(HTTP_STATUS.OK).json({
    message: ORDER_MESSAGES.GET_ORDERS_SUCCESS,
    data: result
  })
}

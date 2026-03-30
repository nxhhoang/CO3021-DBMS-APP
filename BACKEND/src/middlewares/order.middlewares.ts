import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { ORDER_MESSAGES } from '~/constants/messages'
import { PaymentMethod, OrderStatus } from '~/constants/enums'

export const checkoutValidator = validate(
  checkSchema(
    {
      shippingAddressId: {
        notEmpty: { errorMessage: ORDER_MESSAGES.SHIPPING_ADDRESS_IS_REQUIRED },
        isInt: { options: { min: 1 }, errorMessage: 'shippingAddressId must be a positive integer' },
        toInt: true
      },
      paymentMethod: {
        notEmpty: { errorMessage: ORDER_MESSAGES.INVALID_PAYMENT_METHOD },
        isIn: {
          options: [Object.values(PaymentMethod)],
          errorMessage: `paymentMethod must be one of: ${Object.values(PaymentMethod).join(', ')}`
        }
      },
      items: {
        notEmpty: { errorMessage: ORDER_MESSAGES.ITEMS_ARE_REQUIRED },
        isArray: { options: { min: 1 }, errorMessage: 'items must be a non-empty array' }
      },
      'items.*.productId': {
        isString: true,
        notEmpty: true
      },
      'items.*.productName': {
        isString: true,
        trim: true,
        notEmpty: true
      },
      'items.*.sku': {
        isString: true,
        notEmpty: true
      },
      'items.*.quantity': {
        isInt: { options: { min: 1 }, errorMessage: 'quantity must be at least 1' },
        toInt: true
      },
      'items.*.unitPrice': {
        isFloat: { options: { min: 0 }, errorMessage: 'unitPrice must be >= 0' },
        toFloat: true
      }
    },
    ['body']
  )
)

export const updateOrderStatusValidator = validate(
  checkSchema(
    {
      status: {
        notEmpty: { errorMessage: ORDER_MESSAGES.INVALID_ORDER_STATUS },
        isIn: {
          options: [Object.values(OrderStatus)],
          errorMessage: `status must be one of: ${Object.values(OrderStatus).join(', ')}`
        }
      }
    },
    ['body']
  )
)

export const revenueStatsValidator = validate(
  checkSchema(
    {
      startDate: {
        in: ['query'],
        notEmpty: { errorMessage: 'startDate is required' },
        isISO8601: { errorMessage: 'startDate must be a valid date (YYYY-MM-DD)' }
      },
      endDate: {
        in: ['query'],
        notEmpty: { errorMessage: 'endDate is required' },
        isISO8601: { errorMessage: 'endDate must be a valid date (YYYY-MM-DD)' }
      }
    },
    ['query']
  )
)

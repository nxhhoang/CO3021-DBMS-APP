import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { INVENTORY_MESSAGES } from '~/constants/messages'
import { ObjectId } from 'mongodb'

// Check validate middleware structure
export const createInventoryValidator = validate(
  checkSchema({
    productID: {
      notEmpty: { errorMessage: INVENTORY_MESSAGES.PRODUCT_ID_IS_REQUIRED },
      isString: { errorMessage: INVENTORY_MESSAGES.PRODUCT_ID_MUST_BE_A_STRING },
      custom: {
        options: (value) => {
          if (!ObjectId.isValid(value)) {
            throw new Error(INVENTORY_MESSAGES.PRODUCT_ID_IS_INVALID)
          }
          return true
        }
      }
    },
    sku: {
      notEmpty: { errorMessage: INVENTORY_MESSAGES.SKU_IS_REQUIRED },
      isString: { errorMessage: INVENTORY_MESSAGES.SKU_MUST_BE_A_STRING }
    },
    stockQuantity: {
      notEmpty: { errorMessage: INVENTORY_MESSAGES.STOCK_QUANTITY_IS_REQUIRED },
      isInt: {
        options: { min: 0 },
        errorMessage: INVENTORY_MESSAGES.STOCK_QUANTITY_MUST_BE_A_POSITIVE_INTEGER
      }
    }
  }, ['body'])
)

export const updateInventoryValidator = validate(
  checkSchema({
    stockQuantity: {
      notEmpty: { errorMessage: INVENTORY_MESSAGES.STOCK_QUANTITY_IS_REQUIRED },
      isInt: {
        options: { min: 0 },
        errorMessage: INVENTORY_MESSAGES.STOCK_QUANTITY_MUST_BE_A_POSITIVE_INTEGER
      }
    }
  }, ['body'])
)

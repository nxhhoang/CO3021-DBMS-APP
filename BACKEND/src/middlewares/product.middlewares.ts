import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { PRODUCT_MESSAGES } from '~/constants/messages'

const OBJECT_ID_REGEX = /^[a-fA-F0-9]{24}$/

export const searchProductValidator = validate(
  checkSchema(
    {
      categoryId: {
        optional: true,
        isString: { errorMessage: 'categoryId must be a string' },
        matches: {
          options: OBJECT_ID_REGEX,
          errorMessage: PRODUCT_MESSAGES.PRODUCT_ID_INVALID
        }
      },
      price_min: {
        optional: true,
        isFloat: { options: { min: 0 }, errorMessage: 'price_min must be a non-negative number' }
      },
      price_max: {
        optional: true,
        isFloat: { options: { min: 0 }, errorMessage: 'price_max must be a non-negative number' }
      },
      page: {
        optional: true,
        isInt: { options: { min: 1 }, errorMessage: 'page must be a positive integer' }
      },
      limit: {
        optional: true,
        isInt: { options: { min: 1, max: 100 }, errorMessage: 'limit must be between 1 and 100' }
      }
    },
    ['query']
  )
)

export const productIdValidator = validate(
  checkSchema(
    {
      id: {
        in: ['params'],
        matches: {
          options: OBJECT_ID_REGEX,
          errorMessage: PRODUCT_MESSAGES.PRODUCT_ID_INVALID
        }
      }
    },
    ['params']
  )
)

export const productIdParamValidator = validate(
  checkSchema(
    {
      productId: {
        in: ['params'],
        matches: {
          options: OBJECT_ID_REGEX,
          errorMessage: PRODUCT_MESSAGES.PRODUCT_ID_INVALID
        }
      }
    },
    ['params']
  )
)

export const createProductValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: { errorMessage: 'Product name is required' },
        isString: { errorMessage: 'Product name must be a string' },
        trim: true,
        isLength: { options: { min: 1, max: 200 }, errorMessage: 'Product name must be 1-200 characters' }
      },
      categoryId: {
        notEmpty: { errorMessage: 'categoryId is required' },
        isString: { errorMessage: 'categoryId must be a string' },
        matches: {
          options: OBJECT_ID_REGEX,
          errorMessage: 'categoryId must be a valid MongoDB ObjectId'
        }
      },
      base_price: {
        notEmpty: { errorMessage: 'base_price is required' },
        isFloat: { options: { min: 0 }, errorMessage: 'base_price must be a non-negative number' },
        toFloat: true
      },
      description: {
        optional: true,
        isString: { errorMessage: 'description must be a string' },
        trim: true
      },
      images: {
        optional: true,
        isArray: { errorMessage: 'images must be an array' }
      },
      attributes: {
        optional: true,
        isObject: { errorMessage: 'attributes must be an object' }
      }
    },
    ['body']
  )
)

export const updateProductValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: { errorMessage: 'Product name must be a string' },
        trim: true,
        isLength: { options: { min: 1, max: 200 }, errorMessage: 'Product name must be 1-200 characters' }
      },
      categoryId: {
        optional: true,
        isString: { errorMessage: 'categoryId must be a string' },
        matches: {
          options: OBJECT_ID_REGEX,
          errorMessage: 'categoryId must be a valid MongoDB ObjectId'
        }
      },
      base_price: {
        optional: true,
        isFloat: { options: { min: 0 }, errorMessage: 'base_price must be a non-negative number' },
        toFloat: true
      },
      description: {
        optional: true,
        isString: { errorMessage: 'description must be a string' },
        trim: true
      },
      images: {
        optional: true,
        isArray: { errorMessage: 'images must be an array' }
      },
      attributes: {
        optional: true,
        isObject: { errorMessage: 'attributes must be an object' }
      }
    },
    ['body']
  )
)

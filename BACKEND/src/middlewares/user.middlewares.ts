import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { USER_MESSAGES } from '~/constants/messages'

export const updateProfileValidator = validate(
  checkSchema(
    {
      fullName: {
        optional: true,
        isString: { errorMessage: 'fullName must be a string' },
        trim: true,
        isLength: { options: { min: 1, max: 100 } }
      },
      phoneNum: {
        optional: true,
        isString: true,
        trim: true,
        matches: { options: /^[0-9]{9,15}$/, errorMessage: 'phoneNum is invalid' }
      },
      avatar: {
        optional: true,
        isString: true,
        trim: true
      }
    },
    ['body']
  )
)

export const createAddressValidator = validate(
  checkSchema(
    {
      addressLine: {
        notEmpty: { errorMessage: USER_MESSAGES.ADDRESS_LINE_IS_REQUIRED },
        isString: true,
        trim: true
      },
      addressName: {
        optional: true,
        isString: true,
        trim: true
      },
      city: {
        notEmpty: { errorMessage: USER_MESSAGES.CITY_IS_REQUIRED },
        isString: true,
        trim: true
      },
      district: {
        notEmpty: { errorMessage: USER_MESSAGES.DISTRICT_IS_REQUIRED },
        isString: true,
        trim: true
      },
      isDefault: {
        optional: true,
        isBoolean: true,
        toBoolean: true
      }
    },
    ['body']
  )
)

export const updateAddressValidator = validate(
  checkSchema(
    {
      addressLine: { optional: true, isString: true, trim: true },
      addressName: { optional: true, isString: true, trim: true },
      city: { optional: true, isString: true, trim: true },
      district: { optional: true, isString: true, trim: true },
      isDefault: { optional: true, isBoolean: true, toBoolean: true }
    },
    ['body']
  )
)

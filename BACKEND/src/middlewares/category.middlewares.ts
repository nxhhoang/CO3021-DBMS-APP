import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { CATEGORY_MESSAGES } from '~/constants/messages'

const OBJECT_ID_REGEX = /^[a-fA-F0-9]{24}$/
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const dynamicAttributeSchema = {
  optional: true,
  isArray: {
    errorMessage: 'dynamicAttributes must be an array'
  },
  custom: {
    options: (attrs: unknown[]) => {
      if (!Array.isArray(attrs)) return true
      const keys = attrs.map((a: any) => a?.key)
      if (new Set(keys).size !== keys.length) {
        throw new Error('dynamicAttributes keys must be unique')
      }
      for (const attr of attrs as Record<string, unknown>[]) {
        if (!attr['key'] || typeof attr['key'] !== 'string') throw new Error('Each attribute must have a valid key')
        if (!attr['label'] || typeof attr['label'] !== 'string') throw new Error('Each attribute must have a valid label')
        if (!['string', 'number', 'boolean'].includes(attr['dataType'] as string)) {
          throw new Error("Each attribute dataType must be 'string', 'number', or 'boolean'")
        }
        if (typeof attr['isRequired'] !== 'boolean') throw new Error('Each attribute isRequired must be a boolean')
        if (attr['options'] !== undefined && !Array.isArray(attr['options'])) {
          throw new Error('Each attribute options must be an array')
        }
      }
      return true
    }
  }
}

export const createCategoryValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: { errorMessage: 'Name is required' },
        isString: { errorMessage: 'Name must be a string' },
        trim: true,
        isLength: { options: { min: 1, max: 100 }, errorMessage: 'Name length must be from 1 to 100' }
      },
      slug: {
        notEmpty: { errorMessage: 'Slug is required' },
        isString: { errorMessage: 'Slug must be a string' },
        trim: true,
        matches: {
          options: SLUG_REGEX,
          errorMessage: 'Slug must contain only lowercase letters, numbers, and hyphens'
        }
      },
      description: {
        optional: true,
        isString: { errorMessage: 'Description must be a string' },
        trim: true
      },
      isActive: {
        optional: true,
        isBoolean: { errorMessage: 'isActive must be a boolean' }
      },
      dynamicAttributes: dynamicAttributeSchema
    },
    ['body']
  )
)

export const updateCategoryValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: { errorMessage: 'Name must be a string' },
        trim: true,
        isLength: { options: { min: 1, max: 100 }, errorMessage: 'Name length must be from 1 to 100' }
      },
      slug: {
        optional: true,
        isString: { errorMessage: 'Slug must be a string' },
        trim: true,
        matches: {
          options: SLUG_REGEX,
          errorMessage: 'Slug must contain only lowercase letters, numbers, and hyphens'
        }
      },
      description: {
        optional: true,
        isString: { errorMessage: 'Description must be a string' },
        trim: true
      },
      isActive: {
        optional: true,
        isBoolean: { errorMessage: 'isActive must be a boolean' }
      },
      dynamicAttributes: dynamicAttributeSchema
    },
    ['body']
  )
)

export const categoryIdValidator = validate(
  checkSchema(
    {
      id: {
        in: ['params'],
        matches: {
          options: OBJECT_ID_REGEX,
          errorMessage: CATEGORY_MESSAGES.CATEGORY_ID_INVALID
        }
      }
    },
    ['params']
  )
)

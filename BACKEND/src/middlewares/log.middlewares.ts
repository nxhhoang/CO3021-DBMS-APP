import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { ActionType } from '~/constants/enums'
import { LOG_MESSAGES } from '~/constants/messages'

const validActionTypes = Object.values(ActionType)

export const createLogValidator = validate(
  checkSchema(
    {
      actionType: {
        notEmpty: { errorMessage: 'actionType is required' },
        isString: { errorMessage: 'actionType must be a string' },
        isIn: {
          options: [validActionTypes],
          errorMessage: `${LOG_MESSAGES.LOG_ACTION_TYPE_INVALID}. Valid values: ${validActionTypes.join(', ')}`
        }
      },
      targetID: {
        notEmpty: { errorMessage: 'targetID is required' },
        isString: { errorMessage: 'targetID must be a string' }
      },
      metadata: {
        optional: true,
        isObject: { errorMessage: 'metadata must be an object' }
      }
    },
    ['body']
  )
)

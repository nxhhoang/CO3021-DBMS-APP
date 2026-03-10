import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { ActionType } from '~/constants/enums'
import { LOG_MESSAGES } from '~/constants/messages'

const validActionTypes = Object.values(ActionType)

export const createLogValidator = validate(
  checkSchema(
    {
      action_type: {
        notEmpty: { errorMessage: 'action_type is required' },
        isString: { errorMessage: 'action_type must be a string' },
        isIn: {
          options: [validActionTypes],
          errorMessage: `${LOG_MESSAGES.LOG_ACTION_TYPE_INVALID}. Valid values: ${validActionTypes.join(', ')}`
        }
      },
      target_id: {
        notEmpty: { errorMessage: 'target_id is required' },
        isString: { errorMessage: 'target_id must be a string' }
      },
      metadata: {
        optional: true,
        isObject: { errorMessage: 'metadata must be an object' }
      }
    },
    ['body']
  )
)

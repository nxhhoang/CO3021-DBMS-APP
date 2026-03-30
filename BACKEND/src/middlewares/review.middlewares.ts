import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { REVIEW_MESSAGES } from '~/constants/messages'

export const createReviewValidator = validate(
  checkSchema(
    {
      rating: {
        notEmpty: { errorMessage: REVIEW_MESSAGES.REVIEW_RATING_INVALID },
        isInt: { options: { min: 1, max: 5 }, errorMessage: REVIEW_MESSAGES.REVIEW_RATING_INVALID },
        toInt: true
      },
      comment: {
        notEmpty: { errorMessage: REVIEW_MESSAGES.REVIEW_COMMENT_REQUIRED },
        isString: { errorMessage: 'comment must be a string' },
        trim: true
      },
      images: {
        optional: true,
        isArray: { errorMessage: 'images must be an array of URLs' }
      }
    },
    ['body']
  )
)

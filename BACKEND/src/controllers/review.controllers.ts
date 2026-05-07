import { Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { REVIEW_MESSAGES } from '~/constants/messages'
import { CreateReviewReqBody, ProductReviewReqParams } from '~/models/requests/Review.requests'
import { TokenPayload } from '~/models/requests/Auth.requests'
import reviewService from '~/services/review.services'

export const getReviewsController = async (req: Request<ProductReviewReqParams>, res: Response) => {
  const { productId } = req.params
  const result = await reviewService.getReviews(productId)
  res.status(HTTP_STATUS.OK).json({
    message: REVIEW_MESSAGES.REVIEWS_FETCHED,
    data: result
  })
}

export const createReviewController = async (
  req: Request<ProductReviewReqParams, any, CreateReviewReqBody>,
  res: Response
) => {
  const { productId } = req.params
  const { userId } = req.decoded_authorization as TokenPayload
  const result = await reviewService.createReview(productId, req.body, userId)

  res.status(HTTP_STATUS.CREATED).json({
    message: REVIEW_MESSAGES.REVIEW_CREATED,
    data: result
  })
}

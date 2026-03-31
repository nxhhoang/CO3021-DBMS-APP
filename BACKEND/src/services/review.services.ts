import { ObjectId } from 'mongodb'
import Review from '~/models/schemas/Review.schema'
import { CreateReviewReqBody } from '~/models/requests/Review.requests'
import productService from '~/services/product.services'
import { getMongoDB } from '~/utils/mongodb'
import { query } from '~/utils/postgres'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

class ReviewService {
  private get collection() {
    return getMongoDB().collection<Review>('reviews')
  }

  async getReviews(productId: string) {
    return await this.collection.find({ productID: new ObjectId(productId) }).toArray()
  }

  async createReview(productId: string, body: CreateReviewReqBody, userId: string, userName: string) {
    // Verified Purchase check: user must have a DELIVERED order containing this productId
    const purchaseCheck = await query(
      `SELECT 1
       FROM ORDERS o
       JOIN ITEMS oi ON oi.orderID = o.orderID
       WHERE o.userID = $1
         AND oi.productID = $2
         AND o.status = 'DELIVERED'
       LIMIT 1`,
      [userId, productId]
    )

    if (purchaseCheck.rows.length === 0) {
      throw new ErrorWithStatus({
        message: 'You can only review products you have purchased and received.',
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    const newReview = new Review({
      productID: new ObjectId(productId),
      userID: userId,
      userName: userName,
      rating: body.rating,
      comment: body.comment,
      images: body.images || []
    })

    const result = await this.collection.insertOne(newReview)

    // Wait for the query to ensure accurate aggregation
    const stats = await this.collection.aggregate([
      { $match: { productID: new ObjectId(productId) } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
    ]).toArray()

    const totalReviews = stats[0]?.totalReviews || 0
    let avgRating = stats[0]?.avgRating || 0
    avgRating = Math.round(avgRating * 10) / 10

    // Trigger update asynchronously
    productService.updateProductRating(productId, avgRating, totalReviews).catch(err => {
      console.error('[ReviewService] Failed to update product rating:', err)
    })

    return { _id: result.insertedId }
  }
}

const reviewService = new ReviewService()
export default reviewService

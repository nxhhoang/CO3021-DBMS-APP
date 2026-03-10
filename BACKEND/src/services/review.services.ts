import { ObjectId } from 'mongodb'
import { REVIEW_MESSAGES } from '~/constants/messages'
import Review from '~/models/schemas/Review.schema'
import mockReviews from '~/models/data/reviews.data'
import { CreateReviewReqBody } from '~/models/requests/Review.requests'
import productService from '~/services/product.services'

class ReviewService {
  // In-memory store — thay bằng MongoDB collection khi kết nối thật
  private reviews: Review[] = mockReviews

  async getReviews(productId: string) {
    return this.reviews.filter((r) => r.product_id.toHexString() === productId)
  }

  async createReview(productId: string, body: CreateReviewReqBody, userId: string, userName: string) {
    const newReview = new Review({
      product_id: new ObjectId(productId),
      user_id: userId,
      user_name: userName,
      rating: body.rating,
      comment: body.comment,
      images: body.images || []
    })

    this.reviews.push(newReview)

    // Computed Pattern: cập nhật avg_rating và total_reviews trên product
    const productReviews = this.reviews.filter((r) => r.product_id.toHexString() === productId)
    const totalReviews = productReviews.length
    const avgRating =
      totalReviews > 0
        ? Math.round((productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
        : 0

    productService.updateProductRating(productId, avgRating, totalReviews)

    return { _id: newReview._id }
  }
}

const reviewService = new ReviewService()
export default reviewService

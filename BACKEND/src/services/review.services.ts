import { ObjectId } from 'mongodb'
import Review from '~/models/schemas/Review.schema'
import { CreateReviewReqBody } from '~/models/requests/Review.requests'
import productService from '~/services/product.services'
import { getMongoDB } from '~/utils/mongodb'

class ReviewService {
  private get collection() {
    return getMongoDB().collection<Review>('reviews')
  }

  async getReviews(productId: string) {
    return await this.collection.find({ product_id: new ObjectId(productId) }).toArray()
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

    const result = await this.collection.insertOne(newReview)

    // Wait for the query to ensure accurate aggregation
    const stats = await this.collection.aggregate([
      { $match: { product_id: new ObjectId(productId) } },
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

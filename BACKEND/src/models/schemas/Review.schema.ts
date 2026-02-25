import { ObjectId } from 'mongodb'

interface ReviewType {
  _id?: ObjectId
  product_id: ObjectId
  user_id: string
  user_name: string
  rating: number
  comment: string
  images?: string[]
  created_at?: Date
  updated_at?: Date
}

export default class Review {
  _id: ObjectId
  product_id: ObjectId
  user_id: string
  user_name: string
  rating: number
  comment: string
  images: string[]
  created_at: Date
  updated_at: Date

  constructor(review: ReviewType) {
    const date = new Date()
    this._id = review._id || new ObjectId()
    this.product_id = review.product_id
    this.user_id = review.user_id
    this.user_name = review.user_name
    this.rating = review.rating
    this.comment = review.comment
    this.images = review.images || []
    this.created_at = review.created_at || date
    this.updated_at = review.updated_at || date
  }
}

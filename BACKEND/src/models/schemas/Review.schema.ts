import { ObjectId } from 'mongodb'

interface ReviewType {
  _id?: ObjectId
  productID: ObjectId
  userID: string
  userName: string
  rating: number
  comment: string
  images?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export default class Review {
  _id: ObjectId
  productID: ObjectId
  userID: string
  userName: string
  rating: number
  comment: string
  images: string[]
  createdAt: Date
  updatedAt: Date

  constructor(review: ReviewType) {
    const date = new Date()
    this._id = review._id || new ObjectId()
    this.productID = review.productID
    this.userID = review.userID
    this.userName = review.userName
    this.rating = review.rating
    this.comment = review.comment
    this.images = review.images || []
    this.createdAt = review.createdAt || date
    this.updatedAt = review.updatedAt || date
  }
}

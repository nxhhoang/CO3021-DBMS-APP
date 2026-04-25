import { ApiResponse } from './api.types'

export interface Review {
  _id: string
  productID: string
  userID: string
  userName: string
  rating: number
  comment: string
  images: string[]
  createdAt: string
  updatedAt: string
}

// GET /products/:productId/reviews
export interface ReviewPathParams {
  productId: string
}

export type GetReviewsRequest = ReviewPathParams
export type GetReviewsResponse = ApiResponse<Review[]>

// POST /products/:productId/reviews
export interface CreateReviewRequest {
  rating: number
  comment: string
  images?: string[]
}

export type CreateReviewParams = ReviewPathParams
export type CreateReviewResponse = ApiResponse<{ _id: string }>

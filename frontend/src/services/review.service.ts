import { api, privateApi } from '@/lib/axios'
import {
  CreateReviewParams,
  CreateReviewRequest,
  CreateReviewResponse,
  GetReviewsRequest,
  GetReviewsResponse,
  GetReviewResponse,
} from '@/types'

const reviewService = {
  async getReviews({ productId }: GetReviewsRequest) {
    const response = await api.get<GetReviewsResponse>(
      `products/${productId}/reviews`,
    )
    return response.data
  },

  async createReview(
    { productId }: CreateReviewParams,
    data: CreateReviewRequest,
  ) {
    const response = await privateApi.post<CreateReviewResponse>(
      `products/${productId}/reviews`,
      data,
    )
    return response.data
  },
  async getUserReview(productId: string) {
    const response = await privateApi.get<GetReviewResponse>(
      `products/${productId}/reviews/me`,
    )
    return response.data
  },
}

export default reviewService

// privateApi.post<CreateReviewResponse>(`products/${productId}/reviews`, data)

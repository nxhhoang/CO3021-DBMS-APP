import { api, privateApi } from '@/lib/axios'
import {
  CreateReviewParams,
  CreateReviewRequest,
  CreateReviewResponse,
  GetReviewsRequest,
  GetReviewsResponse,
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
}

export default reviewService

import { api, privateApi } from '@/lib/axios';
import {
  GetReviewsResponse,
  CreateReviewRequest,
  CreateReviewResponse,
} from '@/types';

export const reviewService = {
  async getReviews(productId: string) {
    const { data } = await api.get<GetReviewsResponse>(
      `products/${productId}/reviews`,
    );
    return data;
  },

  async createReview(productId: string, payload: CreateReviewRequest) {
    const { data } = await privateApi.post<CreateReviewResponse>(
      `products/${productId}/reviews`,
      payload,
    );
    return data;
  },
};

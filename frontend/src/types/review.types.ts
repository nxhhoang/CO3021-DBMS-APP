import { ApiResponse } from './api.types';

export interface Review {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  images: string[];
}

// GET /products/:productId/reviews
export type GetReviewsRequest = { productId: string };
export type GetReviewsResponse = ApiResponse<Review[]>;

// POST /products/:productId/reviews
export interface CreateReviewRequest {
  rating: number;
  comment: string;
  images: string[];
}

export type CreateReviewResponse = ApiResponse<{ _id: string }>;

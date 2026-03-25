import { ApiResponse, PaginatedResponse } from './api.types';
import { Category } from './category.types';
import { SORT_BY } from '@/constants/enum';

export interface Product {
  _id: string;
  name: string;
  basePrice: number;
  categoryId: string;
  images: string[];
  attributes: Record<string, string | number | boolean>;
  avgRating: number;
  totalReviews: number;
  totalSold: number;
}

export interface ProductResponse extends Omit<Product, 'categoryId'> {
  category: Pick<Category, '_id' | 'name' | 'slug'>;
}

export interface ProductDetail extends ProductResponse {
  description: string;
  inventory: {
    sku: string;
    stockQuantity: number;
  }[];
}

export type AttributesRequest = Record<string, string>;

//GET /products
export type GetProductsRequest = {
  keyword?: string;
  category?: string; //slug
  priceMin?: number;
  priceMax?: number;
  page?: number;
  limit?: number;
  sort?: (typeof SORT_BY)[keyof typeof SORT_BY];
  attributes?: AttributesRequest;
};

export type GetProductsResponse = PaginatedResponse<ProductResponse[]>;

//GET /products/:id
export type GetProductDetailRequest = { id: string };
export type GetProductDetailResponse = ApiResponse<ProductDetail>;

//POST /admin/products
export type CreateProductRequest = Pick<
  Product,
  'name' | 'basePrice' | 'categoryId' | 'attributes'
>;

export type CreateProductResponse = ApiResponse<ProductResponse>;

//PUT /admin/products/:id
export type UpdateProductRequest = Partial<CreateProductRequest>;
export type UpdateProductResponse = ApiResponse<ProductResponse>;

//DELETE /admin/products/:id
export type DeleteProductResponse = ApiResponse<null>;

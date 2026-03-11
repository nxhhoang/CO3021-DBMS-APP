import { ApiResponse, PaginatedResponse } from './api.types';
import { Category } from './category.types';
import { SORT_BY } from '@/constants/enum';

export interface Product {
  _id: string;
  name: string;
  base_price: number;
  categoryId: string;
  images: string[];
  attributes: Record<string, string | number | boolean>;
  avg_rating: number;
  total_reviews: number;
  total_sold: number;
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

//GET /products
export type GetProductsRequest = {
  keyword?: string;
  category?: string; //slug
  price_min?: number;
  price_max?: number;
  page?: number;
  limit?: number;
  sort?: (typeof SORT_BY)[keyof typeof SORT_BY];
  attrs?: Record<string, string>;
};

export type GetProductsResponse = PaginatedResponse<ProductResponse[]>;

//GET /products/:id
export type GetProductDetailRequest = { id: string };
export type GetProductDetailResponse = ApiResponse<ProductDetail>;

//POST /admin/products
export type CreateProductRequest = Pick<
  Product,
  'name' | 'base_price' | 'categoryId' | 'attributes'
>;

export type CreateProductResponse = ApiResponse<ProductResponse>;

//PUT /admin/products/:id
export type UpdateProductRequest = Partial<CreateProductRequest>;
export type UpdateProductResponse = ApiResponse<ProductResponse>;

//DELETE /admin/products/:id
export type DeleteProductResponse = ApiResponse<null>;

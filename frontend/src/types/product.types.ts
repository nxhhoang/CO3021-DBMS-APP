import { ApiResponse } from './api.types';

export interface Product {
  _id: string;
  name: string;
  base_price: number;
  categoryId: string;
  images: string[];
  attributes: Record<string, string | number | boolean>;
}

export interface ProductDetail extends Product {
  description: string;
  inventory: {
    sku: string;
    stockQuantity: number;
  }[];
}

//GET /products
export type GetProductsRequest = {
  keyword?: string;
  categoryId?: string;
  price_min?: number;
  price_max?: number;
  page?: number;
  limit?: number;
};

export type GetProductsResponse = ApiResponse<Product[]>;

//GET /products/:id
export type GetProductDetailRequest = { id: string };
export type GetProductDetailResponse = ApiResponse<ProductDetail>;

//POST /admin/products
export type CreateProductRequest = Pick<
  Product,
  'name' | 'base_price' | 'categoryId' | 'attributes'
>;

export type CreateProductResponse = ApiResponse<Product>;

//PUT /admin/products/:id
export type UpdateProductRequest = Partial<CreateProductRequest>;
export type UpdateProductResponse = ApiResponse<Product>;

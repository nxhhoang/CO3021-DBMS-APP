import { api, privateApi } from '@/lib/axios';
import {
  GetProductDetailRequest,
  GetProductDetailResponse,
  CreateProductRequest,
  CreateProductResponse,
  GetProductsResponse,
  GetProductsRequest,
} from '@/types';
import { buildQueryParams } from '../utils/queryParams';

export const productService = {
  async getProducts(params: GetProductsRequest) {
    const queryParams = buildQueryParams(params);
    const { data } = await api.get<GetProductsResponse>(`products`, {
      params: queryParams,
    });
    return data;
  },

  async getProductDetail(id: string) {
    const { data } = await api.get<GetProductDetailResponse>(`products/${id}`);
    return data;
  },

  async createProduct(payload: CreateProductRequest) {
    const { data } = await privateApi.post<CreateProductResponse>(
      `admin/products`,
      payload,
    );
    return data;
  },

  async updateProduct(id: string, payload: Partial<CreateProductRequest>) {
    const { data } = await privateApi.put<CreateProductResponse>(
      `admin/products/${id}`,
      payload,
    );
    return data;
  },

  async deleteProduct(id: string) {
    const { data } = await privateApi.delete(`admin/products/${id}`);
    return data;
  },
};

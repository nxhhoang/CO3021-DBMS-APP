import { api, privateApi } from '@/lib/axios';
import {
  GetProductDetailRequest,
  GetProductDetailResponse,
  CreateProductRequest,
  CreateProductResponse,
  GetProductsResponse,
} from '@/types';

export const productService = {
  async getProducts(params?: GetProductsResponse) {
    const res = await api.get<GetProductsResponse>(`products`, { params });
    return res.data;
  },

  async getProductDetail({ id }: GetProductDetailRequest) {
    const res = await api.get<GetProductDetailResponse>(`products/${id}`);
    return res.data;
  },

  async createProduct(data: CreateProductRequest) {
    const res = await privateApi.post<CreateProductResponse>(
      `admin/products`,
      data,
    );
    return res.data;
  },
};

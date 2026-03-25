import { api, privateApi } from '@/lib/axios';
import {
  GetCategoriesResponse,
  GetCategoriesRequest,
  CreateCategoryRequest,
  CreateCategoryResponse,
  GetCategoryDetailResponse,
} from '@/types';

export const categoryService = {
  async getCategories(params?: GetCategoriesRequest) {
    const { data } = await api.get<GetCategoriesResponse>(`categories`, { params });
    return data;
  },

  async getCategoryDetail(id: string) {
    const { data } = await api.get<GetCategoryDetailResponse>(`categories/${id}`);
    return data;
  },

  async createCategory(payload: CreateCategoryRequest) {
    const { data } = await privateApi.post<CreateCategoryResponse>(`categories`, payload);
    return data;
  },
};
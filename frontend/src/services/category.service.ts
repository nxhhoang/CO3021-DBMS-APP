import { api } from '@/lib/axios';
import {
  GetCategoriesRequest,
  GetCategoriesResponse,
} from '@/types/category.types';

const categoryService = {
  async getCategories(params: GetCategoriesRequest) {
    const response = await api.get<GetCategoriesResponse>('categories', {
      params,
    });
    return response.data;
  },
};

export default categoryService;

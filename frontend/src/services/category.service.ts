import { api, privateApi } from '@/lib/axios'
import {
  GetCategoriesRequest,
  GetCategoriesResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
} from '@/types/category.types'

const categoryService = {
  async getCategories(params: GetCategoriesRequest) {
    const response = await api.get<GetCategoriesResponse>('categories', {
      params,
    })
    return response.data
  },
  async createCategory(data: CreateCategoryRequest) {
    const response = await privateApi.post<CreateCategoryResponse>(
      'admin/categories',
      data,
    )
    return response.data
  },
}

export default categoryService

// api.get('categories', { params: { isActive: true } });
// api.post('admin/categories', { name: 'New Category', slug: 'new-category', description: 'This is a new category', isActive: true, dynamicAttributes: [] });

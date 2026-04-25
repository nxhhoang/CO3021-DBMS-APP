import { api, privateApi } from '@/lib/axios'
import {
  GetCategoriesRequest,
  GetCategoriesResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
  DeleteCategoryResponse,
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
  async updateCategory(id: string, data: UpdateCategoryRequest) {
    const response = await privateApi.put<UpdateCategoryResponse>(
      `admin/categories/${id}`,
      data,
    )
    return response.data
  },
  async deleteCategory(id: string) {
    const response = await privateApi.delete<DeleteCategoryResponse>(
      `admin/categories/${id}`,
    )
    return response.data
  },
}

export default categoryService

// api.get('categories', { params: { isActive: true } });
// api.post('admin/categories', { name: 'New Category', slug: 'new-category', description: 'This is a new category', isActive: true, dynamicAttributes: [] });
// api.put('admin/categories/category-1', { name: 'Updated Category' });
// api.delete('admin/categories/category-1');

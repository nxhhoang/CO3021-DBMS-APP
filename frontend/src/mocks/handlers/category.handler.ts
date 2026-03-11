import { http, HttpResponse } from 'msw';
import { BASE_URL } from '@/constants/api';
import { MOCK_CATEGORIES } from '../data/categories';
import {
  Category,
  GetCategoriesRequest,
  GetCategoriesResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
} from '@/types/category.types';

export const categoryHandlers = [
  // GET /categories
  http.get(`${BASE_URL}/categories`, (req) => {
    const url = new URL(req.request.url);
    const isActive = url.searchParams.get('isActive');
    let filteredCategories = MOCK_CATEGORIES;
    if (isActive !== null) {
      const activeFlag = isActive === 'true';
      filteredCategories = filteredCategories.filter(
        (cat) => cat.isActive === activeFlag,
      );
    }
    return HttpResponse.json<GetCategoriesResponse>({
      message: 'Lấy danh sách danh mục thành công',
      data: filteredCategories,
    });
  }),
];

// Example GET /categories using api:
// api.get('categories', { params: { isActive: true } })

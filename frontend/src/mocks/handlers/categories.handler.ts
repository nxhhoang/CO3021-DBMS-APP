import { http, HttpResponse } from 'msw';
import { BASE_URL } from '@/constants/api';
import { MOCK_CATEGORIES } from '../data/categories';
import {
  GetCategoriesResponse,
  GetCategoriesRequest,
  CreateCategoryRequest,
  CreateCategoryResponse,
} from '@/types';

// Helper parse query
const parseQuery = (url: URL): GetCategoriesRequest => {
  const sp = url.searchParams;

  return {
    isActive: sp.get('isActive') ? sp.get('isActive') === 'true' : undefined,
  };
};

export const categoriesHandlers = [
  // GET /categories
  http.get<{}, never, GetCategoriesResponse>(
    `${BASE_URL}/categories`,
    ({ request }) => {
      const url = new URL(request.url);
      const query = parseQuery(url);

      let categories = [...MOCK_CATEGORIES];

      // filter isActive
      if (query.isActive !== undefined) {
        categories = categories.filter((c) => c.isActive === query.isActive);
      }

      return HttpResponse.json({
        message: 'Lấy danh sách danh mục thành công',
        data: categories,
      });
    },
  ),

  // POST /categories
  http.post<{}, CreateCategoryRequest, CreateCategoryResponse>(
    `${BASE_URL}/categories`,
    async ({ request }) => {
      const body = await request.json();

      const newCategory = {
        _id: `category-${Date.now()}`,
        ...body,
      };

      MOCK_CATEGORIES.push(newCategory);

      return HttpResponse.json(
        {
          message: 'Tạo danh mục thành công',
          data: newCategory,
        },
        { status: 201 },
      );
    },
  ),
];

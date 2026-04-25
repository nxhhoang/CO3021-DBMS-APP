import { http, HttpResponse } from 'msw'
import { BASE_URL } from '@/constants/api'
import { MOCK_CATEGORIES } from '../data/categories'
import {
  Category,
  GetCategoriesRequest,
  GetCategoriesResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
} from '@/types/category.types'

export const categoryHandlers = [
  // 1. GET /categories (Public)
  http.get(`${BASE_URL}/categories`, (req) => {
    const url = new URL(req.request.url)
    const isActive = url.searchParams.get('isActive')
    let filteredCategories = MOCK_CATEGORIES

    if (isActive !== null) {
      const activeFlag = isActive === 'true'
      filteredCategories = filteredCategories.filter(
        (cat) => cat.isActive === activeFlag,
      )
    }

    return HttpResponse.json<GetCategoriesResponse>({
      message: 'Lấy danh sách danh mục thành công',
      data: filteredCategories,
    })
  }),

  // 2. POST /admin/categories (Admin) - HANDLER MỚI THÊM
  http.post(`${BASE_URL}/admin/categories`, async ({ request }) => {
    const newCategoryData = (await request.json()) as CreateCategoryRequest

    // Giả lập tạo ID mới (thông thường Backend sẽ làm việc này)
    const newId = `cat_${Math.random().toString(36).substr(2, 9)}`

    return HttpResponse.json<CreateCategoryResponse>(
      {
        message: 'Tạo danh mục thành công',
        data: { _id: newId },
      },
      { status: 201 },
    )
  }),
]

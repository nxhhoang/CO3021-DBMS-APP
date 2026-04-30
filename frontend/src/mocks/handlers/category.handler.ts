import { http, HttpResponse } from 'msw'
import { BASE_URL } from '@/constants/api'
import { isAdmin, mockDb, requireSession } from '../data/mockDb'
import {
  GetCategoriesResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
  DeleteCategoryResponse,
} from '@/types/category.types'

export const categoryHandlers = [
  // 1. GET /categories (Public)
  http.get(`${BASE_URL}/categories`, (req) => {
    const url = new URL(req.request.url)
    const isActive = url.searchParams.get('isActive')
    let filteredCategories = mockDb.categories

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
    const auth = requireSession(request.headers.get('Authorization'))
    if (!auth.ok) return HttpResponse.json(auth.response, { status: auth.status })
    if (!isAdmin(auth.session.userId)) {
      return HttpResponse.json({ message: 'Forbidden', data: null }, { status: 403 })
    }

    const newCategoryData = (await request.json()) as CreateCategoryRequest

    // Giả lập tạo ID mới (thông thường Backend sẽ làm việc này)
    const newId = `cat_${Math.random().toString(36).substr(2, 9)}`

    mockDb.categories.push({
      _id: newId,
      name: newCategoryData.name,
      slug: newCategoryData.slug,
      description: newCategoryData.description ?? '',
      isActive: newCategoryData.isActive ?? true,
      dynamicAttributes: (newCategoryData.dynamicAttributes ?? []).map((a) => ({
        key: a.key,
        label: a.label,
        dataType: a.dataType,
        options: a.options ?? [],
      })),
      variantAttributes: (newCategoryData.variantAttributes ?? []).map((a) => ({
        key: a.key,
        label: a.label,
        dataType: a.dataType,
        options: a.options ?? [],
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return HttpResponse.json<CreateCategoryResponse>(
      {
        message: 'Tạo danh mục thành công',
        data: { _id: newId },
      },
      { status: 201 },
    )
  }),

  // 3. PUT /admin/categories/:id
  http.put<{ id: string }, UpdateCategoryRequest, UpdateCategoryResponse>(
    `${BASE_URL}/admin/categories/:id`,
    async ({ request, params }) => {
      const auth = requireSession(request.headers.get('Authorization'))
      if (!auth.ok) return HttpResponse.json(auth.response, { status: auth.status })
      if (!isAdmin(auth.session.userId)) {
        return HttpResponse.json({ message: 'Forbidden', data: null }, { status: 403 })
      }

      const { id } = params
      const body = (await request.json()) as UpdateCategoryRequest

      const idx = mockDb.categories.findIndex((c) => c._id === id)
      if (idx === -1) {
        return HttpResponse.json({ message: 'Category not found', data: null }, { status: 404 })
      }

      const {
        dynamicAttributes: dynamicAttributesInput,
        variantAttributes: variantAttributesInput,
        ...rest
      } = body

      const normalizedDynamicAttributes =
        dynamicAttributesInput === undefined
          ? undefined
          : dynamicAttributesInput.map((a) => ({
              key: a.key,
              label: a.label,
              dataType: a.dataType,
              options: a.options ?? [],
            }))
      const normalizedVariantAttributes =
        variantAttributesInput === undefined
          ? undefined
          : variantAttributesInput.map((a) => ({
              key: a.key,
              label: a.label,
              dataType: a.dataType,
              options: a.options ?? [],
            }))

      mockDb.categories[idx] = {
        ...mockDb.categories[idx],
        ...rest,
        ...(normalizedDynamicAttributes ? { dynamicAttributes: normalizedDynamicAttributes } : {}),
        ...(normalizedVariantAttributes ? { variantAttributes: normalizedVariantAttributes } : {}),
        updatedAt: new Date().toISOString(),
      }

      return HttpResponse.json({
        message: 'Cập nhật danh mục thành công',
        data: {
          _id: mockDb.categories[idx]._id,
          name: mockDb.categories[idx].name,
          isActive: mockDb.categories[idx].isActive,
        },
      })
    },
  ),

  // 4. DELETE /admin/categories/:id (soft delete)
  http.delete<{ id: string }, never, DeleteCategoryResponse>(
    `${BASE_URL}/admin/categories/:id`,
    ({ request, params }) => {
      const auth = requireSession(request.headers.get('Authorization'))
      if (!auth.ok) return HttpResponse.json(auth.response, { status: auth.status })
      if (!isAdmin(auth.session.userId)) {
        return HttpResponse.json({ message: 'Forbidden', data: null }, { status: 403 })
      }

      const { id } = params
      const idx = mockDb.categories.findIndex((c) => c._id === id)
      if (idx === -1) {
        return HttpResponse.json({ message: 'Category not found', data: null }, { status: 404 })
      }

      mockDb.categories[idx].isActive = false
      mockDb.categories[idx].updatedAt = new Date().toISOString()

      return HttpResponse.json({
        message: 'Xóa danh mục thành công',
        data: { _id: id, isActive: false },
      })
    },
  ),
]

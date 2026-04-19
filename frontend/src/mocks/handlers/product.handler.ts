import { http, HttpResponse } from 'msw';
import { BASE_URL } from '@/constants/api';
import { MOCK_PRODUCTS } from '../data/products';
import { MOCK_CATEGORIES } from '../data/categories';
import {
  ProductResponse,
  GetProductsResponse,
  CreateProductRequest,
  UpdateProductRequest,
  UpdateProductResponse,
  DeleteProductResponse,
} from '@/types/product.types'

// Biến tạm để lưu trữ state sản phẩm (giả lập database thay vì dùng hằng số MOCK trực tiếp)
const dynamicProducts = [...MOCK_PRODUCTS]

export const productHandlers = [
  // 1. GET /products (Giữ nguyên logic filter cũ nhưng dùng dynamicProducts)
  http.get(`${BASE_URL}/products`, ({ request }) => {
    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword')?.toLowerCase() || ''
    const categorySlug = url.searchParams.get('category') || ''
    const priceMin = Number(url.searchParams.get('priceMin') || 0)
    const priceMax = Number(
      url.searchParams.get('priceMax') || Number.MAX_SAFE_INTEGER,
    )
    const page = Number(url.searchParams.get('page') || 1)
    const limit = Number(url.searchParams.get('limit') || 10)
    // Filter
    const filtered = dynamicProducts.filter((p) => {
      const matchesKeyword = p.name.toLowerCase().includes(keyword)
      const cat = MOCK_CATEGORIES.find((c) => c.slug === categorySlug)
      const matchesCategory = categorySlug ? p.categoryID === cat?._id : true
      const matchesPrice = p.basePrice >= priceMin && p.basePrice <= priceMax
      // Chỉ lấy sản phẩm đang hoạt động (isActive !== false)
      const isActive = p.isActive !== false

      return matchesKeyword && matchesCategory && matchesPrice && isActive
    })

    // Map Response
    const mapped: ProductResponse[] = filtered.map((p) => {
      const cat = MOCK_CATEGORIES.find((c) => c._id === p.categoryID)
      const { categoryID, ...rest } = p
      void categoryID
      return {
        ...rest,
        category: {
          _id: cat?._id || '',
          name: cat?.name || '',
          slug: cat?.slug || '',
        },
      }
    })

    const totalItems = mapped.length
    const data = mapped.slice((page - 1) * limit, page * limit)

    return HttpResponse.json({
      message:
        totalItems > 0
          ? `Tìm thấy ${totalItems} sản phẩm`
          : 'Không tìm thấy sản phẩm nào',
      data: {
        products: data,
        pagination: {
          totalItems,
          itemCount: data.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalItems / limit) || 1,
          currentPage: page,
          nextPage: page < Math.ceil(totalItems / limit) ? page + 1 : null,
          hasPrevPage: page > 1,
          hasNextPage: page < Math.ceil(totalItems / limit),
        },
      },
    } as GetProductsResponse)
  }),

  // 2. POST /admin/products (Admin: Thêm sản phẩm)
  http.post(`${BASE_URL}/admin/products`, async ({ request }) => {
    const body = (await request.json()) as CreateProductRequest

    if (!body.name || !body.categoryID || !body.basePrice) {
      return HttpResponse.json(
        { message: 'Thiếu trường bắt buộc' },
        { status: 400 },
      )
    }

    const newProduct = {
      ...body,
      _id: `product-${Date.now()}`,
      isActive: true,
      avg_rating: 0,
      total_reviews: 0,
      total_sold: 0,
    }

    dynamicProducts.push(newProduct)

    return HttpResponse.json(
      { message: 'Tạo sản phẩm thành công', data: { _id: newProduct._id } },
      { status: 201 },
    )
  }),

  // 3. PUT /admin/products/:id (Admin: Sửa sản phẩm)
  http.put(`${BASE_URL}/admin/products/:id`, async ({ params, request }) => {
    const { id } = params
    const body = (await request.json()) as UpdateProductRequest

    const index = dynamicProducts.findIndex((p) => p._id === id)
    if (index === -1) {
      return HttpResponse.json(
        { message: 'Không tìm thấy sản phẩm' },
        { status: 404 },
      )
    }

    // Cập nhật dữ liệu
    dynamicProducts[index] = {
      ...dynamicProducts[index],
      ...body,
    }

    return HttpResponse.json({
      message: 'Cập nhật sản phẩm thành công',
      data: {
        _id: dynamicProducts[index]._id,
        name: dynamicProducts[index].name,
        basePrice: dynamicProducts[index].basePrice,
      },
    } as UpdateProductResponse)
  }),

  // 4. DELETE /admin/products/:id (Admin: Xóa mềm)
  http.delete(`${BASE_URL}/admin/products/:id`, ({ params }) => {
    const { id } = params
    const index = dynamicProducts.findIndex((p) => p._id === id)

    if (index === -1) {
      return HttpResponse.json(
        { message: 'Không tìm thấy sản phẩm' },
        { status: 404 },
      )
    }

    // Thực hiện Soft Delete
    dynamicProducts[index].isActive = false

    return HttpResponse.json({
      message: 'Xóa sản phẩm thành công (Đã ngừng bán)',
      data: {
        _id: id as string,
        isActive: false,
      },
    } as DeleteProductResponse)
  }),
]
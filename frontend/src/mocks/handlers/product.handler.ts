import { http, HttpResponse } from 'msw';
import { BASE_URL } from '@/constants/api';
import { MOCK_PRODUCTS, MOCK_PRODUCT_DETAILS } from '../data/products';
import { MOCK_CATEGORIES } from '../data/categories';
import {
  ProductResponse,
  GetProductsResponse,
  GetProductDetailRequest,
  GetProductDetailResponse,
  ProductDetail,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  UpdateProductResponse,
} from '@/types/product.types';

export const productHandlers = [
  // GET /products
  http.get(`${BASE_URL}/products`, (req) => {
    const url = new URL(req.request.url);
    const keyword = url.searchParams.get('keyword') || '';
    const categorySlug = url.searchParams.get('category') || '';
    const price_min = parseFloat(url.searchParams.get('price_min') || '0');
    const price_max = parseFloat(
      url.searchParams.get('price_max') || 'Infinity',
    );
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const sort = url.searchParams.get('sort') || '';

    let filteredProducts = MOCK_PRODUCTS.filter((product) => {
      const categoryObj = MOCK_CATEGORIES.find(
        (c) => c._id === product.categoryId,
      );
      return (
        product.name.toLowerCase().includes(keyword.toLowerCase()) &&
        (categorySlug ? categoryObj?.slug === categorySlug : true) &&
        product.base_price >= price_min &&
        product.base_price <= price_max
      );
    });
    if (sort === 'price_desc')
      filteredProducts.sort((a, b) => b.base_price - a.base_price);
    if (sort === 'price_asc')
      filteredProducts.sort((a, b) => a.base_price - b.base_price);

    const productData: ProductResponse[] = filteredProducts.map((p) => {
      const cat = MOCK_CATEGORIES.find((c) => c._id === p.categoryId);
      const { categoryId, ...rest } = p; // Loại bỏ categoryId, thay bằng object category
      return {
        ...rest,
        category: {
          _id: cat?._id || '',
          name: cat?.name || '',
          slug: cat?.slug || '',
        },
      };
    });

    const totalItems = productData.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedData = productData.slice((page - 1) * limit, page * limit);

    return HttpResponse.json({
      message: `Tìm thấy ${totalItems} sản phẩm`,
      data: paginatedData,
      pagination: {
        totalItems,
        itemCount: paginatedData.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
        nextPage: page < totalPages ? page + 1 : null,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  }),
];
// Example of GET /products/:id using fetch:
// fetch('http://localhost:3000/api/v1/products?keyword=mac')

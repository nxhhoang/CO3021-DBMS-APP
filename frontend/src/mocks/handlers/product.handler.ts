import { http, HttpResponse } from 'msw';
import { BASE_URL } from '@/constants/api';
import { MOCK_PRODUCTS, MOCK_PRODUCT_DETAILS } from '../data/products';
import { MOCK_CATEGORIES } from '../data/categories';
import {
  ProductResponse,
  GetProductsRequest,
  GetProductsResponse,
  GetProductDetailRequest,
  GetProductDetailResponse,
  ProductDetail,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  Product,
} from '@/types/product.types';

const SORT_MAP: Record<string, (a: Product, b: Product) => number> = {
  priceASC: (a, b) => a.basePrice - b.basePrice,
  priceDESC: (a, b) => b.basePrice - a.basePrice,

  ratingASC: (a, b) => a.avgRating - b.avgRating,
  ratingDESC: (a, b) => b.avgRating - a.avgRating,

  soldASC: (a, b) => a.totalSold - b.totalSold,
  soldDESC: (a, b) => b.totalSold - a.totalSold,
};

export const productHandlers = [
  // GET /products
  http.get<{}, never, GetProductsResponse>(`${BASE_URL}/products`, (req) => {
    const url = new URL(req.request.url);

    const keyword = url.searchParams.get('keyword') || '';
    const categorySlug = url.searchParams.get('category') || '';
    const priceMin = Number(url.searchParams.get('priceMin') || 0);
    const priceMax = Number(url.searchParams.get('priceMax') || Infinity);
    const page = Number(url.searchParams.get('page') || 1);
    const limit = Number(url.searchParams.get('limit') || 10);
    const sort = url.searchParams.get('sort') || '';

    // parse attrs[ram]=16GB style
    const attrs: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      const match = key.match(/^attrs\[(.+)\]$/);
      if (match) {
        attrs[match[1]] = value;
      }
    });

    let filtered = [...MOCK_PRODUCTS];

    // =========================
    // 1. KEYWORD FILTER
    // =========================
    if (keyword) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(keyword.toLowerCase()),
      );
    }

    // =========================
    // 2. CATEGORY FILTER
    // =========================
    if (categorySlug) {
      filtered = filtered.filter((p) => {
        const cat = MOCK_CATEGORIES.find((c) => c._id === p.categoryId);
        return cat?.slug === categorySlug;
      });
    }

    // =========================
    // 3. PRICE FILTER
    // =========================
    filtered = filtered.filter(
      (p) => p.basePrice >= priceMin && p.basePrice <= priceMax,
    );

    // =========================
    // 4. ATTRIBUTES FILTER
    // =========================
    Object.entries(attrs).forEach(([key, value]) => {
      filtered = filtered.filter((p) => p.attributes?.[key] === value);
    });

    // =========================
    // 5. SORTING
    // =========================
    if (sort && SORT_MAP[sort]) {
      filtered.sort(SORT_MAP[sort]);
    }

    // DEFAULT SORT (API spec: soldDESC)
    if (!sort) {
      filtered.sort((a, b) => b.totalSold - a.totalSold);
    }

    // =========================
    // 6. PAGINATION
    // =========================
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit);

    const paginated = filtered.slice((page - 1) * limit, page * limit);

    // =========================
    // 7. MAP RESPONSE FORMAT
    // =========================
    const data = paginated.map((p) => {
      const cat = MOCK_CATEGORIES.find((c) => c._id === p.categoryId);

      const { categoryId, ...rest } = p;

      return {
        ...rest,
        category: {
          _id: cat?._id || '',
          name: cat?.name || '',
          slug: cat?.slug || '',
        },
      };
    });

    return HttpResponse.json(
      {
        message: `Tìm thấy ${totalItems} sản phẩm`,
        data,
        pagination: {
          totalItems,
          itemCount: data.length,
          itemsPerPage: limit,
          totalPages,
          currentPage: page,
          nextPage: page < totalPages ? page + 1 : null,
          hasPreviousPage: page > 1,
          hasNextPage: page < totalPages,
        },
      },
      { status: 200 },
    );
  }),

  // GET /products/:id
  http.get<GetProductDetailRequest, never, GetProductDetailResponse>(
    `${BASE_URL}/products/:id`,
    (req) => {
      const { id } = req.params as GetProductDetailRequest;
      const product = MOCK_PRODUCT_DETAILS[id];

      if (!product) {
        return HttpResponse.json(
          {
            message: 'Sản phẩm không tồn tại',
            data: null,
          },
          { status: 404 },
        );
      }

      return HttpResponse.json(
        {
          message: 'Chi tiết sản phẩm',
          data: product,
        },
        { status: 200 },
      );
    },
  ),
];
// Example of GET /products/:id using fetch:
// fetch('http://localhost:3000/api/v1/products?keyword=mac')

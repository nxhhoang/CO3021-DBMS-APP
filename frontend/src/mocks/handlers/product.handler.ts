import { http, HttpResponse } from 'msw';
import { BASE_URL } from '@/constants/api';
import { MOCK_PRODUCTS } from '../data/products';
import { MOCK_CATEGORIES } from '../data/categories';
import { ProductResponse, GetProductsResponse } from '@/types/product.types';

export const productHandlers = [
  // GET /products
  http.get(`${BASE_URL}/products`, ({ request }) => {
    const url = new URL(request.url);

    // ===== 1. Params =====
    const keyword = url.searchParams.get('keyword')?.toLowerCase() || '';
    const categorySlug = url.searchParams.get('category') || '';
    const priceMin = Number(url.searchParams.get('price_min') || 0);
    const priceMax = Number(
      url.searchParams.get('price_max') || Number.MAX_SAFE_INTEGER,
    );
    const page = Number(url.searchParams.get('page') || 1);
    const limit = Number(url.searchParams.get('limit') || 10);
    const sort = url.searchParams.get('sort') || '';

    // ===== 2. Dynamic attrs =====
    const filterAttrs: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      const match = key.match(/^attrs\[(.*)\]$/);
      if (match && value && value !== 'all') {
        filterAttrs[match[1]] = value;
      }
    });

    // ===== 3. Resolve category =====
    const category = categorySlug
      ? MOCK_CATEGORIES.find((c) => c.slug === categorySlug)
      : null;

    // ===== 4. Filter =====
    let filtered = MOCK_PRODUCTS.filter((p) => {
      const matchesKeyword = p.name.toLowerCase().includes(keyword);

      const matchesCategory = category ? p.categoryID === category._id : true;

      const matchesPrice = p.base_price >= priceMin && p.base_price <= priceMax;

      const matchesAttrs = Object.entries(filterAttrs).every(([key, value]) => {
        if (!p.attributes) return false;
        return String(p.attributes[key]) === value;
      });

      return matchesKeyword && matchesCategory && matchesPrice && matchesAttrs;
    }); // ✅ thiếu dấu ; ở đây (đã thêm)

    // ===== 5. Sorting =====
    const sortMap: Record<string, (a: any, b: any) => number> = {
      price_asc: (a, b) => a.base_price - b.base_price,
      price_desc: (a, b) => b.base_price - a.base_price,
      sold_desc: (a, b) => (b.total_sold ?? 0) - (a.total_sold ?? 0),
      rating_desc: (a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0),
    };

    if (sortMap[sort]) {
      filtered = [...filtered].sort(sortMap[sort]);
    }

    // ===== 6. Map → ProductResponse =====
    const mapped: ProductResponse[] = filtered.map((p) => {
      const cat = MOCK_CATEGORIES.find((c) => c._id === p.categoryID);

      const { categoryID, ...rest } = p;

      return {
        ...rest,
        category: {
          _id: cat?._id || '',
          name: cat?.name || '',
          slug: cat?.slug || '',
        },
      };
    });

    // ===== 7. Pagination =====
    const totalItems = mapped.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;

    const start = (page - 1) * limit;
    const end = start + limit;

    const data = mapped.slice(start, end);

    const pagination = {
      totalItems,
      itemCount: data.length,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
      nextPage: page < totalPages ? page + 1 : null,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    };

    return HttpResponse.json({
      message:
        totalItems > 0
          ? `Tìm thấy ${totalItems} sản phẩm`
          : 'Không tìm thấy sản phẩm nào',
      data,
      pagination,
    } as GetProductsResponse);
  }),

  // Các handler khác như GET /products/:id, POST, PUT, DELETE sẽ được thêm ở đây
];

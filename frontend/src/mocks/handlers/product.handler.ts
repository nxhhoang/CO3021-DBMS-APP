import { http, HttpResponse } from 'msw';
import { BASE_URL } from '@/constants/api';
import { MOCK_PRODUCTS } from '../data/products';
import { MOCK_CATEGORIES } from '../data/categories';
import { ProductResponse, GetProductsResponse } from '@/types/product.types';

export const productHandlers = [
  // GET /products
  http.get(`${BASE_URL}/products`, (req) => {
    const url = new URL(req.request.url);

    // 1. Trích xuất các tham số cơ bản từ URL
    const keyword = url.searchParams.get('keyword') || '';
    const categoryId = url.searchParams.get('category') || '';
    const price_min = parseFloat(url.searchParams.get('price_min') || '0');
    const price_max = parseFloat(
      url.searchParams.get('price_max') || 'Infinity',
    );
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const sort = url.searchParams.get('sort') || '';

    // 2. Trích xuất Dynamic Attributes: attrs[key]=value
    const filterAttrs: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      const match = key.match(/^attrs\[(.*)\]$/);
      if (match && value !== 'all' && value !== '') {
        filterAttrs[match[1]] = value;
      }
    });

    // 3. Thực hiện lọc dữ liệu
    let filteredProducts = MOCK_PRODUCTS.filter((product) => {
      // Lọc theo từ khóa (tên sản phẩm)
      const matchesKeyword = product.name
        .toLowerCase()
        .includes(keyword.toLowerCase());

      // Lọc theo ID danh mục
      const matchesCategory = categoryId
        ? (() => {
            const cat = MOCK_CATEGORIES.find((c) => c.slug === categoryId);
            return product.categoryId === cat?._id;
          })()
        : true;

      // Lọc theo khoảng giá
      const matchesPrice =
        product.base_price >= price_min && product.base_price <= price_max;

      // Lọc theo thuộc tính động (RAM, CPU, v.v.)
      // Chỉ lọc nếu sản phẩm có chứa field 'attributes'
      const matchesAttrs = Object.entries(filterAttrs).every(([key, value]) => {
        return product.attributes && product.attributes[key] === value;
      });

      return matchesKeyword && matchesCategory && matchesPrice && matchesAttrs;
    });

    // 4. Logic Sắp xếp (Sorting)
    switch (sort) {
      case 'price_asc':
        filteredProducts.sort((a, b) => a.base_price - b.base_price);
        break;
      case 'price_desc':
        filteredProducts.sort((a, b) => b.base_price - a.base_price);
        break;
      case 'sold_desc':
        filteredProducts.sort(
          (a, b) => (b.total_sold || 0) - (a.total_sold || 0),
        );
        break;
      case 'rating_desc':
        filteredProducts.sort(
          (a, b) => (b.avg_rating || 0) - (a.avg_rating || 0),
        );
        break;
      default:
        // Mặc định có thể sắp xếp theo ID hoặc ngày tạo nếu có
        break;
    }

    // 5. Map dữ liệu sang ProductResponse (thay categoryId bằng object category chi tiết)
    const productData: ProductResponse[] = filteredProducts.map((p) => {
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

    // 6. Phân trang (Pagination)
    const totalItems = productData.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedData = productData.slice((page - 1) * limit, page * limit);

    return HttpResponse.json({
      message:
        totalItems > 0
          ? `Tìm thấy ${totalItems} sản phẩm`
          : 'Không tìm thấy sản phẩm nào',
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
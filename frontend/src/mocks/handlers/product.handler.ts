import { http, HttpResponse } from 'msw';
import { BASE_URL } from '@/constants/api';
import { MOCK_PRODUCTS, MOCK_PRODUCT_DETAILS } from '../data/products';
import {
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
  http.get<{}, never, GetProductsResponse>(
    `${BASE_URL}/products`,
    ({ request }) => {
      const url = new URL(request.url);
      const keyword = url.searchParams.get('keyword') || '';
      const categoryId = url.searchParams.get('categoryId') || '';
      const priceMin = parseFloat(url.searchParams.get('price_min') || '0');
      const page = parseInt(url.searchParams.get('page') || '1', 10);

      // Lọc sản phẩm dựa trên keyword, categoryId và priceMin
      let filteredProducts = MOCK_PRODUCTS.filter((product) => {
        const matchesKeyword =
          product.name.toLowerCase().includes(keyword.toLowerCase()) ||
          Object.values(product.attributes).some((attr) =>
            String(attr).toLowerCase().includes(keyword.toLowerCase()),
          );
        const matchesCategory =
          !categoryId || product.categoryId === categoryId;
        const matchesPrice = product.base_price >= priceMin;

        return matchesKeyword && matchesCategory && matchesPrice;
      });

      // Phân trang
      const pageSize = 10; // Số sản phẩm trên mỗi trang
      const totalProducts = filteredProducts.length;
      const totalPages = Math.ceil(totalProducts / pageSize);
      const paginatedProducts = filteredProducts.slice(
        (page - 1) * pageSize,
        page * pageSize,
      );

      return HttpResponse.json({
        message: `Tìm thấy ${totalProducts} sản phẩm`,
        data: {
          products: paginatedProducts,
          totalPages,
          currentPage: page,
        },
      });
    },
  ),

  // GET /products/:id
  http.get<GetProductDetailRequest, never, GetProductDetailResponse>(
    `${BASE_URL}/products/:id`,
    ({ params }) => {
      const { id } = params;
      const productDetail = MOCK_PRODUCT_DETAILS[id];

      if (!productDetail) {
        return HttpResponse.json(
          { message: 'Sản phẩm không tồn tại', data: null },
          { status: 404 },
        );
      }

      return HttpResponse.json(
        { message: 'Lấy chi tiết sản phẩm thành công', data: productDetail },
        { status: 200 },
      );
    },
  ),

  // POST /admin/products
  http.post<{}, CreateProductRequest, CreateProductResponse>(
    `${BASE_URL}/admin/products`,
    async ({ request }) => {
      const productData = await request.json();
      // Logic for creating a new product
      const newProduct: ProductDetail = {
        _id: String(Date.now()), // Mock ID generation
        name: productData.name,
        base_price: productData.base_price,
        categoryId: productData.categoryId,
        images: [], // You can add logic to handle image uploads
        attributes: productData.attributes,
        description: '', // You can extend CreateProductRequest to include description
        inventory: [], // Initial inventory can be empty or you can extend the request to include it
      };

      // Add the new product to the mock data (in-memory)
      MOCK_PRODUCTS.push(newProduct);
      MOCK_PRODUCT_DETAILS[newProduct._id] = newProduct;

      return HttpResponse.json(
        { message: 'Tạo sản phẩm thành công', data: newProduct },
        { status: 201 },
      );
    },
  ),
];

// Example for GET /products using fetch API
// fetch('http://localhost:3000/api/v1/products?keyword=macbook&categoryId=laptops&price_min=1000&page=1')
//   .then((res) => res.json())
//   .then((data) => console.log(data));

// Example for GET /products/:id using fetch API
// fetch('http://localhost:3000/api/v1/products/1')
//   .then((res) => res.json())
//   .then((data) => console.log(data));

// Example for POST /admin/products using fetch API

// fetch('http://localhost:3000/api/v1/admin/products', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({
//     name: 'Jordan air force 1',
//     categoryId: 'clothing',
//     base_price: 200,
//     attributes: { size: 'L', material: 'Cotton' },
//   }),
// })
//   .then((res) => res.json())
//   .then((data) => console.log(data));

import { api, privateApi } from '../lib/axios'
import {
  GetProductDetailRequest,
  GetProductDetailResponse,
  CreateProductRequest,
  CreateProductResponse,
  GetProductsResponse,
  GetProductsRequest,
  UpdateProductRequest,
  UpdateProductResponse,
  DeleteProductResponse,
} from '@/types'

export const productService = {
  async getProducts(params?: GetProductsRequest) {
    const res = await api.get<GetProductsResponse>(`products`, { params })
    return res.data
  },

  async getProductDetail({ productId }: GetProductDetailRequest) {
    const res = await api.get<GetProductDetailResponse>(`products/${productId}`)
    return res.data
  },

  async createProduct(data: CreateProductRequest) {
    const res = await privateApi.post<CreateProductResponse>(
      `admin/products`,
      data,
    )
    return res.data
  },

  async updateProduct({
    productId,
    data,
  }: {
    productId: string
    data: UpdateProductRequest
  }) {
    const res = await privateApi.put<UpdateProductResponse>(
      `admin/products/${productId}`,
      data,
    )
    return res.data
  },

  async deleteProduct({ productId }: { productId: string }) {
    const res = await privateApi.delete<DeleteProductResponse>(
      `admin/products/${productId}`,
    )
    return res.data
  },
}

// api.get('products', { params: { keyword: 'macbook',  page: 1 } });
// api.post('admin/products', { name: 'New Product', categoryID: 'category-1', basePrice: 1000 });
// api.put('admin/products/product-1', { name: 'Updated Product Name' });
// api.delete('admin/products/product-1');

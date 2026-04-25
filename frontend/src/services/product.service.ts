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
    const payload = res.data

    if (!payload?.data) return payload

    const normalizedInventory = (payload.data.inventory ?? []).map((item) => {
      const normalizedPrice = item.skuPrice ?? item.sku_price ?? 0
      return {
        ...item,
        skuPrice: normalizedPrice,
        sku_price: item.sku_price ?? normalizedPrice,
        attributes: item.attributes ?? {},
      }
    })

    return {
      ...payload,
      data: {
        ...payload.data,
        inventory: normalizedInventory,
      },
    }
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

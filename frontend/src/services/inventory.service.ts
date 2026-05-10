import { privateApi } from '../lib/axios'

export interface CreateSkuRequest {
  productID: string
  sku: string
  skuPrice: number
  stockQuantity: number
  attributes: Record<string, any>
}

export const inventoryService = {
  async createSku(data: CreateSkuRequest) {
    const res = await privateApi.post('admin/inventories/sku', data)
    return res.data
  },

  async updateStock(inventoryId: string, stockQuantity: number) {
    const res = await privateApi.put(`admin/inventories/${inventoryId}`, { stockQuantity })
    return res.data
  },
}

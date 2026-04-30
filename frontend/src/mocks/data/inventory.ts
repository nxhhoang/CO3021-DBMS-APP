import { SKU, Inventory } from '@/types/product.types'

/**
 * IMPORTANT:
 * - `SKU` in frontend types uses `skuPrice` (camelCase)
 * - Some backend payloads use `sku_price`, but frontend normalizes it in service layer.
 * - Keep mock consistent with other mock modules (products/cart/orders).
 */
export const MOCK_SKU: SKU[] = [
  // product-1 (MacBook Pro M3)
  {
    sku: 'MBP-M3-16-512',
    productID: 'product-1',
    skuPrice: 45990000,
    attributes: { color: 'Silver', ram: '16GB', storage: '512GB' },
  },
  {
    sku: 'MBP-M3-32-1TB',
    productID: 'product-1',
    skuPrice: 52990000,
    attributes: { color: 'Space Gray', ram: '32GB', storage: '1TB' },
  },

  // product-3 (iPhone 15 Pro Max)
  {
    sku: 'IP15PM-256-BLACK',
    productID: 'product-3',
    skuPrice: 33990000,
    attributes: { color: 'Black', storage: '256GB' },
  },
  {
    sku: 'IP15PM-512-NATURAL',
    productID: 'product-3',
    skuPrice: 36990000,
    attributes: { color: 'Natural', storage: '512GB' },
  },

  // product-6 (Nike Air Jordan 1 Low)
  {
    sku: 'AJ1L-40-BLACK',
    productID: 'product-6',
    skuPrice: 3990000,
    attributes: { color: 'Black', size: 40 },
  },
  {
    sku: 'AJ1L-41-WHITE',
    productID: 'product-6',
    skuPrice: 3990000,
    attributes: { color: 'White', size: 41 },
  },
]

export const MOCK_INVENTORY: Inventory[] = MOCK_SKU.map((sku) => ({
  sku: sku.sku,
  skuPrice: sku.skuPrice,
  sku_price: sku.skuPrice,
  attributes: sku.attributes,
  stockQuantity: sku.sku.startsWith('MBP') ? 12 : sku.sku.startsWith('IP15') ? 18 : 20,
}))

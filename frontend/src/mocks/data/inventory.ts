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

  // product-2 (Dell XPS 15)
  {
    sku: 'XPS15-I7-16-512',
    productID: 'product-2',
    skuPrice: 42990000,
    attributes: { color: 'Platinum', ram: '16GB', storage: '512GB' },
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

  // product-4 (Samsung Galaxy S24 Ultra)
  {
    sku: 'S24U-256-TITAN',
    productID: 'product-4',
    skuPrice: 29990000,
    attributes: { color: 'Titanium Grey', storage: '256GB' },
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

  // product-7 (ASUS ROG Zephyrus G14)
  {
    sku: 'ROG-G14-R9-32-1TB',
    productID: 'product-7',
    skuPrice: 38990000,
    attributes: { color: 'Eclipse Gray', ram: '32GB', storage: '1TB' },
  },

  // product-8 (ThinkPad X1 Carbon)
  {
    sku: 'X1C12-I7-32-1TB',
    productID: 'product-8',
    skuPrice: 49990000,
    attributes: { color: 'Black', ram: '32GB', storage: '1TB' },
  },

  // product-12 (Adidas Ultraboost)
  {
    sku: 'UB-LIGHT-42-WHITE',
    productID: 'product-12',
    skuPrice: 4500000,
    attributes: { color: 'White', size: 42 },
  },

  // product-13 (Sony A7 IV)
  {
    sku: 'SONY-A74-BODY',
    productID: 'product-13',
    skuPrice: 58990000,
    attributes: { color: 'Black', bundle: 'Body only' },
  },
]

export const MOCK_INVENTORY: Inventory[] = MOCK_SKU.map((sku) => ({
  sku: sku.sku,
  productID: sku.productID,
  skuPrice: sku.skuPrice,
  sku_price: sku.skuPrice,
  attributes: sku.attributes,
  stockQuantity: Math.floor(Math.random() * 50) + 5,
}))

export interface InventoryItem {
  id: number
  productID: string // MongoDB ObjectId as string
  sku: string
  skuPrice: number
  stockQuantity: number
  createdAt: Date
  updatedAt: Date
}

const mockInventory: InventoryItem[] = [
  // MacBook Pro M3 (666000000000000000000001)
  { id: 1, productID: '666000000000000000000001', sku: 'MBP-M3-16-512', skuPrice: 2499, stockQuantity: 50, createdAt: new Date('2026-01-10T00:00:00Z'), updatedAt: new Date('2026-01-10T00:00:00Z') },
  { id: 2, productID: '666000000000000000000001', sku: 'MBP-M3-32-1TB', skuPrice: 2999, stockQuantity: 10, createdAt: new Date('2026-01-10T00:00:00Z'), updatedAt: new Date('2026-01-10T00:00:00Z') },

  // Dell XPS 15 (666000000000000000000002)
  { id: 3, productID: '666000000000000000000002', sku: 'DXPS15-32-1TB', skuPrice: 1799, stockQuantity: 30, createdAt: new Date('2026-01-12T00:00:00Z'), updatedAt: new Date('2026-01-12T00:00:00Z') },
  { id: 4, productID: '666000000000000000000002', sku: 'DXPS15-16-512', skuPrice: 1499, stockQuantity: 45, createdAt: new Date('2026-01-12T00:00:00Z'), updatedAt: new Date('2026-01-12T00:00:00Z') },

  // ASUS ROG G14 (666000000000000000000003)
  { id: 5, productID: '666000000000000000000003', sku: 'ROG-G14-16-512', skuPrice: 1499, stockQuantity: 25, createdAt: new Date('2026-01-15T00:00:00Z'), updatedAt: new Date('2026-01-15T00:00:00Z') },

  // iPhone 15 Pro (666000000000000000000004)
  { id: 6, productID: '666000000000000000000004', sku: 'IP15P-128', skuPrice: 999, stockQuantity: 100, createdAt: new Date('2026-01-20T00:00:00Z'), updatedAt: new Date('2026-01-20T00:00:00Z') },
  { id: 7, productID: '666000000000000000000004', sku: 'IP15P-256', skuPrice: 1099, stockQuantity: 80, createdAt: new Date('2026-01-20T00:00:00Z'), updatedAt: new Date('2026-01-20T00:00:00Z') },
  { id: 8, productID: '666000000000000000000004', sku: 'IP15P-512', skuPrice: 1299, stockQuantity: 35, createdAt: new Date('2026-01-20T00:00:00Z'), updatedAt: new Date('2026-01-20T00:00:00Z') },

  // Samsung S24 Ultra (666000000000000000000005)
  { id: 9, productID: '666000000000000000000005', sku: 'S24U-256', skuPrice: 1199, stockQuantity: 60, createdAt: new Date('2026-01-22T00:00:00Z'), updatedAt: new Date('2026-01-22T00:00:00Z') },
  { id: 10, productID: '666000000000000000000005', sku: 'S24U-512', skuPrice: 1399, stockQuantity: 40, createdAt: new Date('2026-01-22T00:00:00Z'), updatedAt: new Date('2026-01-22T00:00:00Z') },

  // ThinkPad X1 (666000000000000000000006) - sản phẩm inactive
  { id: 11, productID: '666000000000000000000006', sku: 'TPX1-16-512', skuPrice: 1699, stockQuantity: 5, createdAt: new Date('2026-01-05T00:00:00Z'), updatedAt: new Date('2026-01-05T00:00:00Z') }
]

export default mockInventory

export interface InventoryItem {
  id: number
  product_id: string // MongoDB ObjectId as string
  sku: string
  sku_price: number
  stock_quantity: number
  created_at: Date
  updated_at: Date
}

const mockInventory: InventoryItem[] = [
  // MacBook Pro M3 (666000000000000000000001)
  { id: 1, product_id: '666000000000000000000001', sku: 'MBP-M3-16-512', sku_price: 2499, stock_quantity: 50, created_at: new Date('2026-01-10T00:00:00Z'), updated_at: new Date('2026-01-10T00:00:00Z') },
  { id: 2, product_id: '666000000000000000000001', sku: 'MBP-M3-32-1TB', sku_price: 2999, stock_quantity: 10, created_at: new Date('2026-01-10T00:00:00Z'), updated_at: new Date('2026-01-10T00:00:00Z') },

  // Dell XPS 15 (666000000000000000000002)
  { id: 3, product_id: '666000000000000000000002', sku: 'DXPS15-32-1TB', sku_price: 1799, stock_quantity: 30, created_at: new Date('2026-01-12T00:00:00Z'), updated_at: new Date('2026-01-12T00:00:00Z') },
  { id: 4, product_id: '666000000000000000000002', sku: 'DXPS15-16-512', sku_price: 1499, stock_quantity: 45, created_at: new Date('2026-01-12T00:00:00Z'), updated_at: new Date('2026-01-12T00:00:00Z') },

  // ASUS ROG G14 (666000000000000000000003)
  { id: 5, product_id: '666000000000000000000003', sku: 'ROG-G14-16-512', sku_price: 1499, stock_quantity: 25, created_at: new Date('2026-01-15T00:00:00Z'), updated_at: new Date('2026-01-15T00:00:00Z') },

  // iPhone 15 Pro (666000000000000000000004)
  { id: 6, product_id: '666000000000000000000004', sku: 'IP15P-128', sku_price: 999, stock_quantity: 100, created_at: new Date('2026-01-20T00:00:00Z'), updated_at: new Date('2026-01-20T00:00:00Z') },
  { id: 7, product_id: '666000000000000000000004', sku: 'IP15P-256', sku_price: 1099, stock_quantity: 80, created_at: new Date('2026-01-20T00:00:00Z'), updated_at: new Date('2026-01-20T00:00:00Z') },
  { id: 8, product_id: '666000000000000000000004', sku: 'IP15P-512', sku_price: 1299, stock_quantity: 35, created_at: new Date('2026-01-20T00:00:00Z'), updated_at: new Date('2026-01-20T00:00:00Z') },

  // Samsung S24 Ultra (666000000000000000000005)
  { id: 9, product_id: '666000000000000000000005', sku: 'S24U-256', sku_price: 1199, stock_quantity: 60, created_at: new Date('2026-01-22T00:00:00Z'), updated_at: new Date('2026-01-22T00:00:00Z') },
  { id: 10, product_id: '666000000000000000000005', sku: 'S24U-512', sku_price: 1399, stock_quantity: 40, created_at: new Date('2026-01-22T00:00:00Z'), updated_at: new Date('2026-01-22T00:00:00Z') },

  // ThinkPad X1 (666000000000000000000006) - sản phẩm inactive
  { id: 11, product_id: '666000000000000000000006', sku: 'TPX1-16-512', sku_price: 1699, stock_quantity: 5, created_at: new Date('2026-01-05T00:00:00Z'), updated_at: new Date('2026-01-05T00:00:00Z') }
]

export default mockInventory

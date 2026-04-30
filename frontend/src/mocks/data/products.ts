import { Product, ProductDetail } from '@/types'

/**
 * IMPORTANT:
 * - IDs must be consistent across products <-> inventory <-> cart <-> orders
 * - Keep the canonical product ids as `product-<n>` so other mock modules can reference safely.
 */
const MOCK_PRODUCTS: Product[] = [
  {
    _id: 'product-1',
    categoryID: 'cat-laptop',
    name: 'MacBook Pro M3',
    slug: 'macbook-pro-m3',
    basePrice: 45990000,
    description: 'Hiệu năng mạnh mẽ cho lập trình và đồ họa.',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1200',
    ],
    attributes: { brand: 'Apple', cpu: 'Apple M3', screenSize: 14, os: 'macOS' },
    isActive: true,
    avgRating: 4.8,
    totalReviews: 142,
    totalSold: 67,
  },
  {
    _id: 'product-2',
    categoryID: 'cat-laptop',
    name: 'Dell XPS 15 2024',
    slug: 'dell-xps-15-2024',
    basePrice: 42990000,
    description: 'Màn hình đẹp, build chắc chắn, phù hợp làm việc lâu dài.',
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1200',
    ],
    attributes: { brand: 'Dell', cpu: 'Core i7', screenSize: 15.6, os: 'Windows 11' },
    isActive: true,
    avgRating: 4.7,
    totalReviews: 98,
    totalSold: 41,
  },
  {
    _id: 'product-3',
    categoryID: 'cat-dien-thoai',
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    basePrice: 33990000,
    description: 'Khung titan, camera mạnh, trải nghiệm iOS mượt.',
    images: [
      'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=1200',
    ],
    attributes: { brand: 'Apple', os: 'iOS', battery: 4500 },
    isActive: true,
    avgRating: 4.9,
    totalReviews: 256,
    totalSold: 133,
  },
  {
    _id: 'product-4',
    categoryID: 'cat-dien-thoai',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    basePrice: 29990000,
    description: 'Camera 200MP, nhiều tính năng AI.',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=1200',
    ],
    attributes: { brand: 'Samsung', os: 'Android', battery: 5000 },
    isActive: true,
    avgRating: 4.8,
    totalReviews: 210,
    totalSold: 101,
  },
  {
    _id: 'product-5',
    categoryID: 'cat-dong-ho',
    name: 'Apple Watch Ultra 2',
    slug: 'apple-watch-ultra-2',
    basePrice: 21990000,
    description: 'Bền bỉ, phù hợp vận động mạnh và outdoor.',
    images: [
      'https://images.unsplash.com/photo-1434493907317-a46b59bc043a?auto=format&fit=crop&q=80&w=1200',
    ],
    attributes: { brand: 'Apple', material: 'Titan', waterResistance: 100 },
    isActive: true,
    avgRating: 4.7,
    totalReviews: 62,
    totalSold: 28,
  },
  {
    _id: 'product-6',
    categoryID: 'cat-giay',
    name: 'Nike Air Jordan 1 Low',
    slug: 'nike-air-jordan-1-low',
    basePrice: 3990000,
    description: 'Phong cách cổ điển, dễ phối đồ.',
    images: [
      'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&q=80&w=1200',
    ],
    attributes: { brand: 'Nike', gender: 'Unisex', sportType: 'Basketball' },
    isActive: true,
    avgRating: 4.6,
    totalReviews: 88,
    totalSold: 72,
  },
]

/**
 * Pre-built product details to cover inventory normalization logic in `productService.getProductDetail`.
 */
export const MOCK_PRODUCT_DETAILS: Record<string, ProductDetail> = {
  'product-1': {
    ...MOCK_PRODUCTS.find((p) => p._id === 'product-1')!,
    category: { _id: 'cat-laptop', name: 'Laptop', slug: 'laptop' },
    inventory: [
      {
        sku: 'MBP-M3-16-512',
        skuPrice: 45990000,
        stockQuantity: 12,
        attributes: { color: 'Silver', ram: '16GB', storage: '512GB' },
      },
      {
        sku: 'MBP-M3-32-1TB',
        skuPrice: 52990000,
        stockQuantity: 5,
        attributes: { color: 'Space Gray', ram: '32GB', storage: '1TB' },
      },
    ],
  },
  'product-3': {
    ...MOCK_PRODUCTS.find((p) => p._id === 'product-3')!,
    category: { _id: 'cat-dien-thoai', name: 'Điện thoại', slug: 'dien-thoai' },
    inventory: [
      {
        sku: 'IP15PM-256-BLACK',
        skuPrice: 33990000,
        stockQuantity: 18,
        attributes: { color: 'Black', storage: '256GB' },
      },
      {
        sku: 'IP15PM-512-NATURAL',
        skuPrice: 36990000,
        stockQuantity: 9,
        attributes: { color: 'Natural', storage: '512GB' },
      },
    ],
  },
}

export { MOCK_PRODUCTS }

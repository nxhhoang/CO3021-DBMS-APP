import { Product, ProductDetail } from '@/types'

/**
 * IMPORTANT:
 * - IDs must be consistent across products <-> inventory <-> cart <-> orders
 * - Keep the canonical product ids as `product-<n>` so other mock modules can reference safely.
 */
const MOCK_PRODUCTS: Product[] = [
  // LAPTOPS
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
    _id: 'product-7',
    categoryID: 'cat-laptop',
    name: 'ASUS ROG Zephyrus G14',
    slug: 'asus-rog-zephyrus-g14',
    basePrice: 38990000,
    description: 'Laptop gaming nhỏ gọn nhưng cực kỳ mạnh mẽ.',
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=1200'],
    attributes: { brand: 'ASUS', cpu: 'Ryzen 9', screenSize: 14, os: 'Windows 11' },
    isActive: true,
    avgRating: 4.6,
    totalReviews: 75,
    totalSold: 53,
  },
  {
    _id: 'product-8',
    categoryID: 'cat-laptop',
    name: 'Lenovo ThinkPad X1 Carbon Gen 12',
    slug: 'thinkpad-x1-carbon-gen-12',
    basePrice: 49990000,
    description: 'Biểu tượng của laptop doanh nhân, bền bỉ và bàn phím tuyệt vời.',
    images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=1200'],
    attributes: { brand: 'Lenovo', cpu: 'Core i7', screenSize: 14, os: 'Windows 11' },
    isActive: true,
    avgRating: 4.9,
    totalReviews: 120,
    totalSold: 88,
  },

  // PHONES
  {
    _id: 'product-3',
    categoryID: 'cat-dien-thoai',
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    basePrice: 33990000,
    description: 'Khung titan, camera mạnh, trải nghiệm iOS mượt.',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1200',
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
    _id: 'product-9',
    categoryID: 'cat-dien-thoai',
    name: 'Xiaomi 14 Ultra',
    slug: 'xiaomi-14-ultra',
    basePrice: 26990000,
    description: 'Ống kính Leica, cảm biến 1 inch, đỉnh cao nhiếp ảnh di động.',
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1200'],
    attributes: { brand: 'Xiaomi', os: 'Android', battery: 5000 },
    isActive: true,
    avgRating: 4.7,
    totalReviews: 85,
    totalSold: 42,
  },

  // WATCHES
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
    _id: 'product-10',
    categoryID: 'cat-dong-ho',
    name: 'Samsung Galaxy Watch 6 Classic',
    slug: 'galaxy-watch-6-classic',
    basePrice: 8990000,
    description: 'Vòng xoay bezel vật lý, thiết kế cổ điển sang trọng.',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200'],
    attributes: { brand: 'Samsung', material: 'Thép không gỉ', waterResistance: 50 },
    isActive: true,
    avgRating: 4.5,
    totalReviews: 140,
    totalSold: 95,
  },
  {
    _id: 'product-11',
    categoryID: 'cat-dong-ho',
    name: 'Garmin Fenix 7 Pro',
    slug: 'garmin-fenix-7-pro',
    basePrice: 18990000,
    description: 'Đồng hồ GPS đa môn thể thao cao cấp với sạc năng lượng mặt trời.',
    images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=1200'],
    attributes: { brand: 'Garmin', material: 'Titan', waterResistance: 100 },
    isActive: true,
    avgRating: 4.9,
    totalReviews: 50,
    totalSold: 22,
  },

  // SHOES
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
  {
    _id: 'product-12',
    categoryID: 'cat-giay',
    name: 'Adidas Ultraboost Light',
    slug: 'adidas-ultraboost-light',
    basePrice: 4500000,
    description: 'Công nghệ Boost êm ái nhất của Adidas dành cho chạy bộ.',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200'],
    attributes: { brand: 'Adidas', gender: 'Unisex', sportType: 'Running' },
    isActive: true,
    avgRating: 4.8,
    totalReviews: 210,
    totalSold: 156,
  },

  // CAMERAS
  {
    _id: 'product-13',
    categoryID: 'cat-camera',
    name: 'Sony A7 IV',
    slug: 'sony-a7-iv',
    basePrice: 58990000,
    description: 'Máy ảnh full-frame hybrid hoàn hảo cho cả chụp và quay.',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200'],
    attributes: { brand: 'Sony', resolution: '33MP', sensorType: 'CMOS', videoQuality: '4K' },
    isActive: true,
    avgRating: 4.9,
    totalReviews: 45,
    totalSold: 19,
  },
  {
    _id: 'product-14',
    categoryID: 'cat-camera',
    name: 'Fujifilm X-T5',
    slug: 'fujifilm-x-t5',
    basePrice: 43990000,
    description: 'Thiết kế retro, giả lập màu phim tuyệt đẹp.',
    images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=1200'],
    attributes: { brand: 'Fujifilm', resolution: '40MP', sensorType: 'CMOS', videoQuality: '4K' },
    isActive: true,
    avgRating: 4.8,
    totalReviews: 32,
    totalSold: 14,
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
        productID: 'product-1',
        skuPrice: 45990000,
        stockQuantity: 12,
        attributes: { color: 'Silver', ram: '16GB', storage: '512GB' },
      },
      {
        sku: 'MBP-M3-32-1TB',
        productID: 'product-1',
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
        productID: 'product-3',
        skuPrice: 33990000,
        stockQuantity: 18,
        attributes: { color: 'Black', storage: '256GB' },
      },
      {
        sku: 'IP15PM-512-NATURAL',
        productID: 'product-3',
        skuPrice: 36990000,
        stockQuantity: 9,
        attributes: { color: 'Natural', storage: '512GB' },
      },
    ],
  },
}

export { MOCK_PRODUCTS }

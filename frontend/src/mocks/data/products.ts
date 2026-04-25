import { Product, ProductDetail } from '@/types'

const MOCK_PRODUCTS: Product[] = [
  // LAPTOPS
  {
    _id: 'prod-lp-1',
    categoryID: 'cat-laptop',
    name: 'MacBook Pro M3 Max',
    slug: 'macbook-pro-m3-max',
    basePrice: 69900000,
    description: 'Chip M3 Max cực khủng cho đồ họa và lập trình chuyên nghiệp.',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    ],
    attributes: {
      brand: 'Apple',
      cpu: 'M3 Max',
      ram: '32GB',
      storage: '1TB',
    },
    isActive: true,
    avgRating: 4.9,
    totalReviews: 128,
    totalSold: 45,
  },
  {
    _id: 'prod-lp-2',
    categoryID: 'cat-laptop',
    name: 'Dell XPS 15 2024',
    slug: 'dell-xps-15-2024',
    basePrice: 45000000,
    description: 'Thiết kế sang trọng, màn hình OLED 4K tuyệt đẹp.',
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    ],
    attributes: {
      brand: 'Dell',
      cpu: 'Core i9',
      ram: '16GB',
      storage: '512GB',
    },
    isActive: true,
    avgRating: 4.7,
    totalReviews: 85,
    totalSold: 32,
  },

  // ĐIỆN THOẠI
  {
    _id: 'prod-ph-1',
    categoryID: 'cat-dien-thoai',
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    basePrice: 34990000,
    description: 'Khung viền Titan, chip A17 Pro mạnh mẽ nhất.',
    images: [
      'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800',
    ],
    attributes: {
      brand: 'Apple',
      os: 'iOS',
      storage: '256GB',
    },
    isActive: true,
    avgRating: 4.8,
    totalReviews: 245,
    totalSold: 120,
  },
  {
    _id: 'prod-ph-2',
    categoryID: 'cat-dien-thoai',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-s24-ultra',
    basePrice: 29990000,
    description: 'Camera 200MP, tích hợp AI thông minh vượt trội.',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800',
    ],
    attributes: {
      brand: 'Samsung',
      os: 'Android',
      storage: '512GB',
    },
    isActive: true,
    avgRating: 4.7,
    totalReviews: 190,
    totalSold: 88,
  },

  // ĐỒNG HỒ
  {
    _id: 'prod-wt-1',
    categoryID: 'cat-dong-ho',
    name: 'Apple Watch Ultra 2',
    slug: 'apple-watch-ultra-2',
    basePrice: 21990000,
    description: 'Bền bỉ, chống nước chuyên dụng cho vận động viên.',
    images: [
      'https://images.unsplash.com/photo-1434493907317-a46b59bc043a?auto=format&fit=crop&q=80&w=800',
    ],
    attributes: {
      brand: 'Apple',
      material: 'Titanium',
      waterResistance: 100,
    },
    isActive: true,
    avgRating: 4.9,
    totalReviews: 56,
    totalSold: 24,
  },
  {
    _id: 'prod-wt-2',
    categoryID: 'cat-dong-ho',
    name: 'Rolex Submariner Date',
    slug: 'rolex-submariner',
    basePrice: 350000000,
    description: 'Biểu tượng của sự sang trọng và đẳng cấp vượt thời gian.',
    images: [
      'https://images.unsplash.com/photo-1547996160-81dfa63595dd?auto=format&fit=crop&q=80&w=800',
    ],
    attributes: {
      brand: 'Rolex',
      material: 'Steel',
      movement: 'Automatic',
    },
    isActive: true,
    avgRating: 5.0,
    totalReviews: 12,
    totalSold: 5,
  },

  // GIÀY
  {
    _id: 'prod-sh-1',
    categoryID: 'cat-giay',
    name: 'Nike Air Jordan 1 Retro Low',
    slug: 'nike-air-jordan-1',
    basePrice: 4200000,
    description: 'Phong cách huyền thoại, thoải mái cho mọi hoạt động.',
    images: [
      'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&q=80&w=800',
    ],
    attributes: {
      brand: 'Nike',
      gender: 'Unisex',
      sportType: 'Basketball',
    },
    isActive: true,
    avgRating: 4.6,
    totalReviews: 88,
    totalSold: 62,
  },
  {
    _id: 'prod-sh-2',
    categoryID: 'cat-giay',
    name: 'Adidas Ultraboost Light',
    slug: 'adidas-ultraboost-light',
    basePrice: 5000000,
    description: 'Êm ái tối đa, phản hồi năng lượng tuyệt vời.',
    images: [
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&q=80&w=800',
    ],
    attributes: {
      brand: 'Adidas',
      gender: 'Men',
      sportType: 'Running',
    },
    isActive: true,
    avgRating: 4.7,
    totalReviews: 120,
    totalSold: 95,
  },
]

export const MOCK_PRODUCT_DETAILS: Record<string, ProductDetail> = {
  'product-1': {
    _id: 'product-1',
    name: 'MacBook Pro M3',
    slug: 'macbook-pro-m3',
    basePrice: 2000,
    isActive: true,
    category: { _id: 'category-1', name: 'Laptops', slug: 'laptop' },
    images: ['/images/macbook.jpg'],
    attributes: { brand: 'Apple' },
    avgRating: 4.5,
    totalReviews: 100,
    totalSold: 50,
    description: 'Apple MacBook Pro with M3 chip',
    inventory: [
      {
        sku: 'MBP-M3-16-512',
        stockQuantity: 50,
        attributes: { color: 'Silver', ram: '16GB', storage: '512GB' },
      },
      {
        sku: 'MBP-M3-32-1TB',
        stockQuantity: 10,
        attributes: { color: 'Space Gray', ram: '32GB', storage: '1TB' },
      },
    ],
  },

  'product-2': {
    _id: 'product-2',
    name: 'iPhone 14 Pro',
    slug: 'iphone-14-pro',
    basePrice: 999,
    isActive: true,
    category: { _id: 'category-2', name: 'Smartphones', slug: 'smartphones' },
    images: ['/images/iphone.jpg'],
    attributes: { brand: 'Apple' },
    avgRating: 4.7,
    totalReviews: 200,
    totalSold: 150,
    description: 'Apple iPhone 14 Pro smartphone',
    inventory: [
      {
        sku: 'IP14P-128-SILVER',
        stockQuantity: 30,
        attributes: { color: 'Silver', storage: '128GB' },
      },
      {
        sku: 'IP14P-256-BLACK',
        stockQuantity: 20,
        attributes: { color: 'Black', storage: '256GB' },
      },
    ],
  },
}

export { MOCK_PRODUCTS }

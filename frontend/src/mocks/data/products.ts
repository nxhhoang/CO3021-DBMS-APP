import { Product } from '@/types'

const MOCK_PRODUCTS: Product[] = [
  // LAPTOPS
  {
    _id: 'prod-lp-1',
    categoryID: 'cat-laptop',
    name: 'MacBook Pro M3 Max',
    slug: 'macbook-pro-m3-max',
    basePrice: 69900000,
    description: 'Chip M3 Max cực khủng cho đồ họa và lập trình chuyên nghiệp.',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'],
    attributes: {
      brand: 'Apple',
      cpu: 'M3 Max',
      ram: '32GB',
      storage: '1TB'
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
    images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800'],
    attributes: {
      brand: 'Dell',
      cpu: 'Core i9',
      ram: '16GB',
      storage: '512GB'
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
    images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800'],
    attributes: {
      brand: 'Apple',
      os: 'iOS',
      storage: '256GB'
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
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800'],
    attributes: {
      brand: 'Samsung',
      os: 'Android',
      storage: '512GB'
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
    images: ['https://images.unsplash.com/photo-1434493907317-a46b59bc043a?auto=format&fit=crop&q=80&w=800'],
    attributes: {
      brand: 'Apple',
      material: 'Titanium',
      waterResistance: 100
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
    images: ['https://images.unsplash.com/photo-1547996160-81dfa63595dd?auto=format&fit=crop&q=80&w=800'],
    attributes: {
      brand: 'Rolex',
      material: 'Steel',
      movement: 'Automatic'
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
    images: ['https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&q=80&w=800'],
    attributes: {
      brand: 'Nike',
      gender: 'Unisex',
      sportType: 'Basketball'
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
    images: ['https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&q=80&w=800'],
    attributes: {
      brand: 'Adidas',
      gender: 'Men',
      sportType: 'Running'
    },
    isActive: true,
    avgRating: 4.7,
    totalReviews: 120,
    totalSold: 95,
  },

  // CAMERA
  {
    _id: 'prod-cm-1',
    categoryID: 'cat-camera',
    name: 'Sony A7R V',
    slug: 'sony-a7r-v',
    basePrice: 92000000,
    description: 'Độ phân giải 61MP, lấy nét AI cực nhanh.',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800'],
    attributes: {
      brand: 'Sony',
      resolution: '61MP',
      videoQuality: '8K'
    },
    isActive: true,
    avgRating: 4.9,
    totalReviews: 34,
    totalSold: 12,
  },
  {
    _id: 'prod-cm-2',
    categoryID: 'cat-camera',
    name: 'Fujifilm X-T5',
    slug: 'fujifilm-x-t5',
    basePrice: 43000000,
    description: 'Màu sắc hoài cổ, cảm biến X-Trans CMOS 5 HR.',
    images: ['https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&q=80&w=800'],
    attributes: {
      brand: 'Fujifilm',
      resolution: '40MP',
      videoQuality: '6.2K'
    },
    isActive: true,
    avgRating: 4.8,
    totalReviews: 45,
    totalSold: 28,
  },
]

export default MOCK_PRODUCTS
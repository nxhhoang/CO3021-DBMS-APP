import { ObjectId } from 'mongodb'
import Product from '~/models/schemas/Product.schema'

// Category IDs from categories.data.ts
const LAPTOP_CAT_ID = new ObjectId('665000000000000000000001')
const SMARTPHONE_CAT_ID = new ObjectId('665000000000000000000002')

const mockProducts: Product[] = [
  new Product({
    _id: new ObjectId('666000000000000000000001'),
    name: 'MacBook Pro M3',
    slug: 'macbook-pro-m3',
    categoryId: LAPTOP_CAT_ID,
    base_price: 2499,
    description: 'Apple MacBook Pro with M3 chip, stunning display and all-day battery life.',
    images: ['https://example.com/macbook-pro-m3.jpg'],
    attributes: { brand: 'Apple', ram: '16GB', storage: '512GB', cpu: 'Apple M3', screen_size: 14.2, weight: 1.6 },
    avg_rating: 4.8,
    total_reviews: 150,
    total_sold: 320,
    is_active: true,
    created_at: new Date('2026-01-10T00:00:00Z'),
    updated_at: new Date('2026-01-10T00:00:00Z')
  }),
  new Product({
    _id: new ObjectId('666000000000000000000002'),
    name: 'Dell XPS 15',
    slug: 'dell-xps-15',
    categoryId: LAPTOP_CAT_ID,
    base_price: 1799,
    description: 'Dell XPS 15 with 4K OLED display and Intel Core i9 processor.',
    images: ['https://example.com/dell-xps-15.jpg'],
    attributes: { brand: 'Dell', ram: '32GB', storage: '1TB', cpu: 'Intel Core i9-13900H', screen_size: 15.6, weight: 1.86 },
    avg_rating: 4.5,
    total_reviews: 98,
    total_sold: 210,
    is_active: true,
    created_at: new Date('2026-01-12T00:00:00Z'),
    updated_at: new Date('2026-01-12T00:00:00Z')
  }),
  new Product({
    _id: new ObjectId('666000000000000000000003'),
    name: 'ASUS ROG Zephyrus G14',
    slug: 'asus-rog-zephyrus-g14',
    categoryId: LAPTOP_CAT_ID,
    base_price: 1499,
    description: 'AMD Ryzen 9 gaming laptop with RTX 4060, compact and powerful.',
    images: ['https://example.com/asus-rog-g14.jpg'],
    attributes: { brand: 'Asus', ram: '16GB', storage: '512GB', cpu: 'AMD Ryzen 9 7940HS', screen_size: 14, weight: 1.65 },
    avg_rating: 4.6,
    total_reviews: 74,
    total_sold: 180,
    is_active: true,
    created_at: new Date('2026-01-15T00:00:00Z'),
    updated_at: new Date('2026-01-15T00:00:00Z')
  }),
  new Product({
    _id: new ObjectId('666000000000000000000004'),
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    categoryId: SMARTPHONE_CAT_ID,
    base_price: 999,
    description: 'Apple iPhone 15 Pro with titanium design and A17 Pro chip.',
    images: ['https://example.com/iphone-15-pro.jpg'],
    attributes: { brand: 'Apple', ram: '8GB', storage: '256GB', color: 'Natural Titanium', screen_size: 6.1 },
    avg_rating: 4.9,
    total_reviews: 320,
    total_sold: 850,
    is_active: true,
    created_at: new Date('2026-01-20T00:00:00Z'),
    updated_at: new Date('2026-01-20T00:00:00Z')
  }),
  new Product({
    _id: new ObjectId('666000000000000000000005'),
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    categoryId: SMARTPHONE_CAT_ID,
    base_price: 1199,
    description: 'Samsung Galaxy S24 Ultra with S Pen and Snapdragon 8 Gen 3.',
    images: ['https://example.com/samsung-s24-ultra.jpg'],
    attributes: { brand: 'Samsung', ram: '12GB', storage: '512GB', color: 'Titanium Black', screen_size: 6.8 },
    avg_rating: 4.7,
    total_reviews: 210,
    total_sold: 630,
    is_active: true,
    created_at: new Date('2026-01-22T00:00:00Z'),
    updated_at: new Date('2026-01-22T00:00:00Z')
  }),
  new Product({
    _id: new ObjectId('666000000000000000000006'),
    name: 'Lenovo ThinkPad X1 Carbon',
    slug: 'lenovo-thinkpad-x1-carbon',
    categoryId: LAPTOP_CAT_ID,
    base_price: 1699,
    description: 'Ultra-light business laptop with military-grade durability and Intel vPro.',
    images: ['https://example.com/thinkpad-x1.jpg'],
    attributes: { brand: 'Lenovo', ram: '16GB', storage: '512GB', cpu: 'Intel Core i7-1365U', screen_size: 14, weight: 1.12 },
    avg_rating: 4.4,
    total_reviews: 55,
    total_sold: 120,
    is_active: false, // Đã bị soft-delete để test
    created_at: new Date('2026-01-05T00:00:00Z'),
    updated_at: new Date('2026-02-01T00:00:00Z')
  })
]

export default mockProducts

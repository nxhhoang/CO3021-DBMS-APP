import { Product, ProductDetail } from '@/types';

export const MOCK_PRODUCTS: Product[] = [
  {
    _id: 'product-1',
    name: 'MacBook Pro M3',
    basePrice: 2000,
    categoryId: 'category-1',
    images: ['/url1.jpg'],
    attributes: { ram: '16GB', storage: '512GB' },
    avgRating: 4.5,
    totalReviews: 100,
    totalSold: 50,
  },
  {
    _id: 'product-2',
    name: 'iPhone 14 Pro',
    basePrice: 999,
    categoryId: 'category-2',
    images: ['/url3.jpg'],
    attributes: { ram: '6GB', storage: '128GB', color: 'Silver' },
    avgRating: 4.7,
    totalReviews: 200,
    totalSold: 150,
  },
  {
    _id: 'product-3',
    name: 'Shirt',
    basePrice: 25,
    categoryId: 'category-3',
    images: ['/url4.jpg'],
    attributes: { size: 'M', color: 'Blue' },
    avgRating: 4.2,
    totalReviews: 50,
    totalSold: 30,
  },
  {
    _id: 'product-4',
    name: 'Running Shoes',
    basePrice: 100,
    categoryId: 'category-4',
    images: ['/url5.jpg'],
    attributes: { size: '9', color: 'White' },
    avgRating: 4.3,
    totalReviews: 80,
    totalSold: 40,
  },
  {
    _id: 'product-5',
    name: 'Wireless Headphones',
    basePrice: 150,
    categoryId: 'category-5',
    images: ['/url6.jpg'],
    attributes: { batteryLife: '20 hours', color: 'Black' },
    avgRating: 4.6,
    totalReviews: 120,
    totalSold: 70,
  },
  {
    _id: 'product-6',
    name: 'Lenovo ThinkPad X1',
    basePrice: 1800,
    categoryId: 'category-1',
    images: ['/url2.jpg'],
    attributes: { ram: '16GB', storage: '1TB' },
    avgRating: 4.4,
    totalReviews: 80,
    totalSold: 40,
  },
  {
    _id: 'product-7',
    name: 'Samsung Galaxy S23',
    basePrice: 899,
    categoryId: 'category-2',
    images: ['/url7.jpg'],
    attributes: { ram: '8GB', storage: '256GB', color: 'Black' },
    avgRating: 4.5,
    totalReviews: 150,
    totalSold: 120,
  },
  {
    _id: 'product-8',
    name: 'Jeans',
    basePrice: 40,
    categoryId: 'category-3',
    images: ['/url8.jpg'],
    attributes: { size: 'L', color: 'Black' },
    avgRating: 4.1,
    totalReviews: 60,
    totalSold: 35,
  },
  {
    _id: 'product-9',
    name: 'Leather Boots',
    basePrice: 80,
    categoryId: 'category-3',
    images: ['/url9.jpg'],
    attributes: { size: '9', color: 'Brown' },
    avgRating: 4.3,
    totalReviews: 70,
    totalSold: 45,
  },
  {
    _id: 'product-10',
    name: 'Smart Watch',
    basePrice: 200,
    categoryId: 'category-5',
    images: ['/url10.jpg'],
    attributes: { batteryLife: '30 hours', color: 'Silver' },
    avgRating: 4.7,
    totalReviews: 90,
    totalSold: 60,
  },
];

export const MOCK_PRODUCT_DETAILS: Record<string, ProductDetail> = {
  'product-1': {
    ...MOCK_PRODUCTS[0],
    category: { _id: 'category-1', name: 'Laptops', slug: 'laptops' },
    description: 'Apple MacBook Pro with M3 chip',
    inventory: [
      { sku: 'MBP-M3-16-512', stockQuantity: 50 },
      { sku: 'MBP-M3-32-1TB', stockQuantity: 10 },
    ],
  },

  'product-2': {
    ...MOCK_PRODUCTS[1],
    category: { _id: 'category-2', name: 'Smartphones', slug: 'smartphones' },
    description: 'Apple iPhone 14 Pro smartphone',
    inventory: [
      { sku: 'IP14P-128-SILVER', stockQuantity: 30 },
      { sku: 'IP14P-256-BLACK', stockQuantity: 20 },
    ],
  },

  'product-3': {
    ...MOCK_PRODUCTS[2],
    category: { _id: 'category-3', name: 'Clothing', slug: 'clothing' },
    description: 'Comfortable cotton shirt',
    inventory: [
      { sku: 'SHIRT-M-BLUE', stockQuantity: 100 },
      { sku: 'SHIRT-L-BLACK', stockQuantity: 50 },
    ],
  },

  'product-4': {
    ...MOCK_PRODUCTS[3],
    category: { _id: 'category-4', name: 'Footwear', slug: 'footwear' },
    description: 'Lightweight running shoes',
    inventory: [
      { sku: 'SHOES-9-WHITE', stockQuantity: 40 },
      { sku: 'SHOES-10-BLACK', stockQuantity: 20 },
    ],
  },

  'product-5': {
    ...MOCK_PRODUCTS[4],
    category: { _id: 'category-5', name: 'Accessories', slug: 'accessories' },
    description: 'Noise-cancelling wireless headphones',
    inventory: [
      { sku: 'HEADPHONES-BLACK', stockQuantity: 70 },
      { sku: 'HEADPHONES-SILVER', stockQuantity: 30 },
    ],
  },

  'product-6': {
    ...MOCK_PRODUCTS[5],
    category: { _id: 'category-1', name: 'Laptops', slug: 'laptops' },
    description: 'Lenovo ThinkPad X1 Carbon laptop',
    inventory: [
      { sku: 'TPX1-16-1TB', stockQuantity: 20 },
      { sku: 'TPX1-32-2TB', stockQuantity: 5 },
    ],
  },

  'product-7': {
    ...MOCK_PRODUCTS[6],
    category: { _id: 'category-2', name: 'Smartphones', slug: 'smartphones' },
    description: 'Samsung Galaxy S23 smartphone',
    inventory: [
      { sku: 'SGS23-256-BLACK', stockQuantity: 50 },
      { sku: 'SGS23-512-SILVER', stockQuantity: 20 },
    ],
  },

  'product-8': {
    ...MOCK_PRODUCTS[7],
    category: { _id: 'category-3', name: 'Clothing', slug: 'clothing' },
    description: 'Stylish denim jeans',
    inventory: [
      { sku: 'JEANS-L-BLACK', stockQuantity: 60 },
      { sku: 'JEANS-M-BLUE', stockQuantity: 80 },
    ],
  },

  'product-9': {
    ...MOCK_PRODUCTS[8],
    category: { _id: 'category-3', name: 'Clothing', slug: 'clothing' },
    description: 'Durable leather boots',
    inventory: [
      { sku: 'BOOTS-9-BROWN', stockQuantity: 45 },
      { sku: 'BOOTS-10-BLACK', stockQuantity: 25 },
    ],
  },

  'product-10': {
    ...MOCK_PRODUCTS[9],
    category: { _id: 'category-5', name: 'Accessories', slug: 'accessories' },
    description: 'Feature-rich smart watch',
    inventory: [
      { sku: 'SMARTWATCH-SILVER', stockQuantity: 60 },
      { sku: 'SMARTWATCH-GOLD', stockQuantity: 20 },
    ],
  },
};

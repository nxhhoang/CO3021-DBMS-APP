import { Product, ProductDetail } from '@/types';

export const MOCK_PRODUCTS: Product[] = [
  {
    _id: '1',
    name: 'MacBook Pro M3',
    base_price: 2000,
    categoryId: 'laptops',
    images: ['url1.jpg'],
    attributes: { ram: '16GB', storage: '512GB' },
  },
  {
    _id: '2',
    name: 'iPhone 14 Pro',
    base_price: 999,
    categoryId: 'smartphones',
    images: ['url3.jpg'],
    attributes: { ram: '6GB', storage: '128GB', color: 'Silver' },
  },
  {
    _id: '3',
    name: 'Shirt',
    base_price: 25,
    categoryId: 'clothing',
    images: ['url4.jpg'],
    attributes: { size: 'M', color: 'Blue' },
  },
  {
    _id: '4',
    name: 'Running Shoes',
    base_price: 100,
    categoryId: 'footwear',
    images: ['url5.jpg'],
    attributes: { size: '9', color: 'White' },
  },
  {
    _id: '5',
    name: 'Wireless Headphones',
    base_price: 150,
    categoryId: 'accessories',
    images: ['url6.jpg'],
    attributes: { batteryLife: '20 hours', color: 'Black' },
  },
];

export const MOCK_PRODUCT_DETAILS: Record<string, ProductDetail> = {
  '1': {
    _id: '1',
    name: 'MacBook Pro M3',
    base_price: 2000,
    categoryId: 'laptops',
    images: ['/images/macbook.jpg'],
    attributes: { brand: 'Apple' },
    description: 'Apple MacBook Pro with M3 chip',
    inventory: [
      { sku: 'MBP-M3-16-512', stockQuantity: 50 },
      { sku: 'MBP-M3-32-1TB', stockQuantity: 10 },
    ],
  },

  '2': {
    _id: '2',
    name: 'iPhone 14 Pro',
    base_price: 999,
    categoryId: 'smartphones',
    images: ['/images/iphone.jpg'],
    attributes: { brand: 'Apple' },
    description: 'Apple iPhone 14 Pro smartphone',
    inventory: [
      { sku: 'IP14P-128-SILVER', stockQuantity: 30 },
      { sku: 'IP14P-256-BLACK', stockQuantity: 20 },
    ],
  },
};

import { SKU, Inventory } from '@/types/product.types';
import { Battery } from 'lucide-react';

const MOCK_SKU: SKU[] = [
  {
    sku: 'MBP-M3-16-512',
    productID: 'product-1',
    sku_price: 25000000,
    attributes: { ram: '16GB', storage: '512GB' },
  },
  {
    sku: 'MBP-M3-32-1TB',
    productID: 'product-1',
    sku_price: 30000000,
    attributes: { ram: '32GB', storage: '1TB' },
  },
  {
    sku: 'IP14P-128-SILVER',
    productID: 'product-2',
    sku_price: 16000000,
    attributes: { ram: '6GB', storage: '128GB', color: 'Silver' },
  },
  {
    sku: 'IP14P-256-BLACK',
    productID: 'product-2',
    sku_price: 20000000,
    attributes: { ram: '6GB', storage: '256GB', color: 'Black' },
  },
  {
    sku: 'SHIRT-M-BLUE',
    productID: 'product-3',
    sku_price: 200,
    attributes: { size: 'M', color: 'Blue' },
  },
  {
    sku: 'SHIRT-L-WHITE',
    productID: 'product-3',
    sku_price: 220,
    attributes: { size: 'L', color: 'White' },
  },
  {
    sku: 'SNKRS-9-WHITE',
    productID: 'product-4',
    sku_price: 1000,
    attributes: { size: '9', color: 'White' },
  },
  {
    sku: 'SNKRS-10-BLACK',
    productID: 'product-4',
    sku_price: 1100,
    attributes: { size: '10', color: 'Black' },
  },
  {
    sku: 'HPHN-001',
    productID: 'product-5',
    sku_price: 1100,
    attributes: { color: 'Black', type: 'Wireless' },
  },
  {
    sku: 'HPHN-002',
    productID: 'product-5',
    sku_price: 1200,
    attributes: { color: 'White', type: 'Wired' },
  },
];

const MOCK_INVENTORY: Inventory[] = MOCK_SKU.map((sku) => ({
  ...sku,
  stockQuantity: Math.floor(Math.random() * 20) + 1, // Random stock between 1 and 20
}));

export { MOCK_SKU, MOCK_INVENTORY };

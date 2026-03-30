import { Cart, CartItem } from '@/types';

export const MOCK_CART_ITEMS: CartItem[] = [
  {
    productID: 'product-1',
    sku: 'MBP-M3-16-512',
    quantity: 1,
    productName: 'MacBook Pro M3',
    image: 'https://picsum.photos/300/200?random=laptop',
    stockQuantity: 5,
    unitPrice: 16000000,
  },
  {
    productID: 'product-2',
    productName: 'iPhone 14 Pro',
    sku: 'IP14P-128-SILVER',
    quantity: 2,
    unitPrice: 28000000,
    image: 'https://picsum.photos/300/200?random=phone',
    stockQuantity: 10,
  },
];

export const MOCK_CART: Cart = {
  cartTotal: 3,
  items: MOCK_CART_ITEMS,
};

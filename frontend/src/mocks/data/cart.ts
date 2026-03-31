import { Cart, CartItem } from '@/types';

export const MOCK_CART_ITEMS: CartItem[] = [
  {
    productID: 'product-1',
    sku: 'MBP-M3-16-512',
    quantity: 1,
    productName: 'MacBook Pro M3',
    image: 'https://picsum.photos/300/200?random=laptop',
    basePrice: 16000000,
    skuPrice: 14000000,
  },
  {
    productID: 'product-2',
    productName: 'iPhone 14 Pro',
    sku: 'IP14P-128-SILVER',
    quantity: 2,
    basePrice: 28000000,
    skuPrice: 25000000,
    image: 'https://picsum.photos/300/200?random=phone',
  },
];

export const MOCK_CART: Cart = {
  cartTotal: 3,
  items: MOCK_CART_ITEMS,
};

import { Cart, CartItem } from '@/types'

export const MOCK_CART_ITEMS: CartItem[] = [
  {
    productId: 'product-1',
    productID: 'product-1',
    sku: 'MBP-M3-16-512',
    quantity: 1,
    productName: 'MacBook Pro M3',
    image: 'https://picsum.photos/300/200?random=laptop',
    basePrice: 45990000,
    skuPrice: 45990000,
    stockQuantity: 8,
  },
  {
    productId: 'product-3',
    productID: 'product-3',
    productName: 'iPhone 15 Pro Max',
    sku: 'IP15PM-256-BLACK',
    quantity: 2,
    basePrice: 33990000,
    skuPrice: 33990000,
    image: 'https://picsum.photos/300/200?random=phone',
    stockQuantity: 12,
  },
]

export const MOCK_CART: Cart = {
  cartTotal: MOCK_CART_ITEMS.reduce(
    (sum, item) => sum + item.skuPrice * item.quantity,
    0,
  ),
  items: MOCK_CART_ITEMS,
}

import { CartItem } from '@/types/cart.types'

const CART_STORAGE_KEY = 'cart'

function normalizeCartItem(raw: Partial<CartItem>): CartItem | null {
  if (!raw.sku || !raw.productName) return null

  const productId = raw.productId || raw.productID
  if (!productId) return null

  const normalizedQuantity = Number.isFinite(raw.quantity)
    ? Math.max(1, Math.floor(raw.quantity as number))
    : 1

  return {
    productId,
    productID: raw.productID || productId,
    sku: raw.sku,
    quantity: normalizedQuantity,
    productName: raw.productName,
    image: raw.image || '',
    basePrice: Number(raw.basePrice) || 0,
    skuPrice: Number(raw.skuPrice) || 0,
    stockQuantity:
      raw.stockQuantity !== undefined
        ? Math.max(0, Number(raw.stockQuantity) || 0)
        : undefined,
    attributes: raw.attributes,
  }
}

export const cartStorage = {
  getItems(): CartItem[] {
    if (typeof window === 'undefined') return []
    try {
      const rawData = sessionStorage.getItem(CART_STORAGE_KEY)
      if (!rawData) return []

      const parsed = JSON.parse(rawData)
      const cartItems = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.items)
          ? parsed.items
          : []

      return cartItems
        .map((item: CartItem) => normalizeCartItem(item as Partial<CartItem>))
        .filter((item: CartItem): item is CartItem => item !== null)
    } catch (error) {
      console.error('Failed to parse cart from sessionStorage:', error)
      return []
    }
  },

  setItems(items: CartItem[]): void {
    if (typeof window === 'undefined') return
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items }))
  },

  clear(): void {
    if (typeof window === 'undefined') return
    sessionStorage.removeItem(CART_STORAGE_KEY)
  },
}

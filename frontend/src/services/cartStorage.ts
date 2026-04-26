import { StoredCartItem } from '@/types/cart.types'

const CART_STORAGE_KEY = 'cart'

function normalizeStoredItem(raw: Record<string, unknown>): StoredCartItem | null {
  const productId = (raw.productId || raw.productID) as string | undefined
  if (!productId || !raw.sku) return null

  const quantity = Number.isFinite(raw.quantity)
    ? Math.max(1, Math.floor(raw.quantity as number))
    : 1

  return { productId, sku: raw.sku as string, quantity }
}

export const cartStorage = {
  getItems(): StoredCartItem[] {
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

      return (cartItems as Record<string, unknown>[])
        .map((item) => normalizeStoredItem(item))
        .filter((item): item is StoredCartItem => item !== null)
    } catch {
      return []
    }
  },

  setItems(items: StoredCartItem[]): void {
    if (typeof window === 'undefined') return
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items }))
  },

  clear(): void {
    if (typeof window === 'undefined') return
    sessionStorage.removeItem(CART_STORAGE_KEY)
  },
}

'use client';

import { useCallback, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cartStore'
import { CartItem } from '@/types'

const CART_STORAGE_KEY = 'cart'

const normalizeCartItem = (raw: Partial<CartItem>): CartItem | null => {
  if (!raw.sku || !raw.productName) return null

  const normalizedQuantity = Number.isFinite(raw.quantity)
    ? Math.max(1, Math.floor(raw.quantity as number))
    : 1

  const productId = raw.productId || raw.productID
  if (!productId) return null

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

const readCartFromSessionStorage = (): CartItem[] => {
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
      .map((item) => normalizeCartItem(item as Partial<CartItem>))
      .filter((item): item is CartItem => item !== null)
  } catch (error) {
    console.error('Failed to parse cart from sessionStorage:', error)
    return []
  }
}

export const useCart = () => {
  const items = useCartStore((s) => s.items)
  const selectedSkus = useCartStore((s) => s.selectedSkus)
  const loading = useCartStore((s) => s.loading)

  const setItems = useCartStore((s) => s.setItems)
  const setLoading = useCartStore((s) => s.setLoading)
  const removeItemStore = useCartStore((s) => s.removeItem)
  const removeMultipleItemsStore = useCartStore((s) => s.removeMultipleItems)
  const toggleItemSelection = useCartStore((s) => s.toggleItemSelection)
  const toggleAllSelection = useCartStore((s) => s.toggleAllSelection)

  const persistCart = useCallback((nextItems: CartItem[]) => {
    sessionStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ items: nextItems }),
    )
    window.dispatchEvent(
      new CustomEvent('cart:updated', {
        detail: {
          totalItems: nextItems.reduce((sum, item) => sum + item.quantity, 0),
        },
      }),
    )
  }, [])

  // Initialize cart data once and sync updates from other cart write points.
  useEffect(() => {
    const syncCart = () => setItems(readCartFromSessionStorage())

    setLoading(true)
    syncCart()
    setLoading(false)

    window.addEventListener('cart:updated', syncCart)
    window.addEventListener('storage', syncCart)

    return () => {
      window.removeEventListener('cart:updated', syncCart)
      window.removeEventListener('storage', syncCart)
    }
  }, [setItems, setLoading])

  const updateQuantity = (sku: string, delta: number) => {
    if (delta === 0) return

    const item = items.find((i) => i.sku === sku)
    if (!item) return

    const maxStock =
      item.stockQuantity && item.stockQuantity > 0 ? item.stockQuantity : 99
    const newQty = Math.max(1, Math.min(item.quantity + delta, maxStock, 99))
    if (newQty === item.quantity) return

    const nextItems = items.map((i) =>
      i.sku === sku ? { ...i, quantity: newQty } : i,
    )
    setItems(nextItems)
    persistCart(nextItems)
  }

  const removeItem = (sku: string) => {
    const nextItems = items.filter((i) => i.sku !== sku)
    removeItemStore(sku)
    persistCart(nextItems)
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng')
  }

  const removeMultipleItems = (skus: string[]) => {
    if (skus.length === 0) return

    const nextItems = items.filter((i) => !skus.includes(i.sku))
    removeMultipleItemsStore(skus)
    persistCart(nextItems)
    toast.success(`Đã xóa ${skus.length} sản phẩm khỏi giỏ hàng`)
  }

  const selectedItems = useMemo(
    () => items.filter((i) => selectedSkus.includes(i.sku)),
    [items, selectedSkus],
  )

  const totalPrice = useMemo(
    () =>
      selectedItems.reduce(
        (sum, i) => sum + (i.skuPrice || i.basePrice || 0) * i.quantity,
        0,
      ),
    [selectedItems],
  )

  return {
    items,
    selectedItems,
    selectedSkus,
    toggleItemSelection,
    toggleAllSelection,
    loading,
    updateQuantity,
    removeItem,
    removeMultipleItems,
    totalPrice,
  }
}
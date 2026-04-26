'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cartStore'
import { CartItem, StoredCartItem } from '@/types'
import { cartStorage } from '@/services/cartStorage'
import { productService } from '@/services/product.service'

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

  const persist = useCallback((nextItems: CartItem[]) => {
    const minimal: StoredCartItem[] = nextItems.map((i) => ({
      productId: i.productId,
      sku: i.sku,
      quantity: i.quantity,
    }))
    cartStorage.setItems(minimal)
    window.dispatchEvent(new CustomEvent('cart:updated'))
  }, [])

  // Merges storage into store while preserving enriched data already in memory.
  // Only quantities/additions/removals are applied — product details are kept.
  const mergeSyncFromStorage = useCallback(() => {
    const stored = cartStorage.getItems()
    const currentItems = useCartStore.getState().items

    const merged: CartItem[] = stored.map((storedItem) => {
      const existing = currentItems.find((i) => i.sku === storedItem.sku)
      if (existing?.productName) {
        return { ...existing, quantity: storedItem.quantity }
      }
      return {
        productId: storedItem.productId,
        sku: storedItem.sku,
        quantity: storedItem.quantity,
        productName: '',
        image: '',
        basePrice: 0,
        skuPrice: 0,
      }
    })

    setItems(merged)
  }, [setItems])

  useEffect(() => {
    mergeSyncFromStorage()

    window.addEventListener('cart:updated', mergeSyncFromStorage)
    window.addEventListener('storage', mergeSyncFromStorage)

    return () => {
      window.removeEventListener('cart:updated', mergeSyncFromStorage)
      window.removeEventListener('storage', mergeSyncFromStorage)
    }
  }, [mergeSyncFromStorage])

  // Fetches fresh product details from the API and enriches all cart items.
  // Call this when rendering the cart page to get current prices and stock.
  const loadCartWithDetails = useCallback(async () => {
    const stored = cartStorage.getItems()
    if (stored.length === 0) {
      setItems([])
      return
    }

    setLoading(true)
    try {
      const uniqueProductIds = [...new Set(stored.map((i) => i.productId))]
      const results = await Promise.all(
        uniqueProductIds.map((id) =>
          productService.getProductDetail({ productId: id }).catch(() => null),
        ),
      )

      const enriched: CartItem[] = stored.flatMap((storedItem) => {
        const res = results.find((r) => r?.data?._id === storedItem.productId)
        const product = res?.data
        if (!product) return []

        const inv = product.inventory?.find((i) => i.sku === storedItem.sku)
        return [
          {
            productId: storedItem.productId,
            sku: storedItem.sku,
            quantity: storedItem.quantity,
            productName: product.name,
            image: product.images?.[0] ?? '',
            basePrice: product.basePrice,
            skuPrice: inv?.skuPrice ?? inv?.sku_price ?? product.basePrice,
            stockQuantity: inv?.stockQuantity ?? 0,
            attributes: inv?.attributes,
          },
        ]
      })

      setItems(enriched)

      // Clean up storage if some products were deleted from the DB
      if (enriched.length !== stored.length) {
        const minimal: StoredCartItem[] = enriched.map((i) => ({
          productId: i.productId,
          sku: i.sku,
          quantity: i.quantity,
        }))
        cartStorage.setItems(minimal)
      }
    } finally {
      setLoading(false)
    }
  }, [setItems, setLoading])

  const addItem = useCallback(
    ({ productId, sku, quantity }: StoredCartItem) => {
      const currentItems = useCartStore.getState().items
      const existingIndex = currentItems.findIndex(
        (item) => item.sku === sku && item.productId === productId,
      )

      let nextItems: CartItem[]

      if (existingIndex >= 0) {
        nextItems = currentItems.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      } else {
        nextItems = [
          ...currentItems,
          {
            productId,
            sku,
            quantity,
            productName: '',
            image: '',
            basePrice: 0,
            skuPrice: 0,
          },
        ]
      }

      setItems(nextItems)
      persist(nextItems)
      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`)
    },
    [setItems, persist],
  )

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
    persist(nextItems)
  }

  const removeItem = (sku: string) => {
    const nextItems = items.filter((i) => i.sku !== sku)
    removeItemStore(sku)
    persist(nextItems)
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng')
  }

  const removeMultipleItems = (skus: string[]) => {
    if (skus.length === 0) return

    const nextItems = items.filter((i) => !skus.includes(i.sku))
    removeMultipleItemsStore(skus)
    persist(nextItems)
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
    addItem,
    updateQuantity,
    removeItem,
    removeMultipleItems,
    totalPrice,
    loadCartWithDetails,
  }
}

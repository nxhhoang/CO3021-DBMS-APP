'use client';

import { useCallback, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cartStore'
import { CartItem } from '@/types'
import { cartStorage } from '@/services/cartStorage'

export const useCart = () => {
  const items = useCartStore((s) => s.items)
  const selectedSkus = useCartStore((s) => s.selectedSkus)
  const loading = useCartStore((s) => s.loading)

  const setItems = useCartStore((s) => s.setItems)
  const removeItemStore = useCartStore((s) => s.removeItem)
  const removeMultipleItemsStore = useCartStore((s) => s.removeMultipleItems)
  const toggleItemSelection = useCartStore((s) => s.toggleItemSelection)
  const toggleAllSelection = useCartStore((s) => s.toggleAllSelection)

  const persist = useCallback((nextItems: CartItem[]) => {
    cartStorage.setItems(nextItems)
    window.dispatchEvent(new CustomEvent('cart:updated'))
  }, [])

  useEffect(() => {
    const syncCart = () => setItems(cartStorage.getItems())

    syncCart()

    window.addEventListener('cart:updated', syncCart)
    window.addEventListener('storage', syncCart)

    return () => {
      window.removeEventListener('cart:updated', syncCart)
      window.removeEventListener('storage', syncCart)
    }
  }, [setItems])

  const addItem = useCallback(
    (
      fields: {
        productId: string
        sku: string
        productName: string
        image: string
        skuPrice: number
        basePrice: number
        stockQuantity?: number
        attributes?: Record<string, string | number | boolean>
      },
      quantity: number,
    ) => {
      const maxQty = Math.min(fields.stockQuantity || 99, 99)
      const existingIndex = items.findIndex(
        (item) =>
          (item.productId || item.productID) === fields.productId &&
          item.sku === fields.sku,
      )

      let nextItems: CartItem[]

      if (existingIndex >= 0) {
        nextItems = items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: Math.min(item.quantity + quantity, maxQty) }
            : item,
        )
      } else {
        const newItem: CartItem = {
          productId: fields.productId,
          productID: fields.productId,
          sku: fields.sku,
          quantity: Math.min(quantity, maxQty),
          productName: fields.productName,
          image: fields.image,
          skuPrice: fields.skuPrice,
          basePrice: fields.basePrice,
          stockQuantity: fields.stockQuantity,
          attributes: fields.attributes,
        }
        nextItems = [...items, newItem]
      }

      setItems(nextItems)
      persist(nextItems)
      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`)
    },
    [items, setItems, persist],
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
  }
}

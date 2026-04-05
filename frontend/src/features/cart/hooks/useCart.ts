'use client';

import { useEffect } from 'react'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cartStore'

export const useCart = () => {
  const items = useCartStore((s) => s.items) || [] // Đảm bảo luôn là mảng
  const selectedSkus = useCartStore((s) => s.selectedSkus) || []

  const setItems = useCartStore((s) => s.setItems)
  const updateQuantityStore = useCartStore((s) => s.updateQuantity)
  const removeItemStore = useCartStore((s) => s.removeItem)
  const toggleItemSelection = useCartStore((s) => s.toggleItemSelection)

  // 1. INIT CART FROM LOCALSTORAGE
  useEffect(() => {
    try {
      const rawData = sessionStorage.getItem('cart')
      if (!rawData) {
        setItems([])
        return
      }

      const localData = JSON.parse(rawData)

      // Xử lý trường hợp dữ liệu là { items: [...] } hoặc [...]
      const cartArray = Array.isArray(localData)
        ? localData
        : localData.items || []

      setItems(cartArray)
    } catch (error) {
      console.error('Failed to parse cart from sessionStorage:', error)
      setItems([])
    }
  }, [setItems])

  // 2. Update quantity
  const updateQuantity = (sku: string, delta: number) => {
    const item = items.find((i) => i.sku === sku)
    if (!item) return

    const newQty = Math.max(1, Math.min(item.quantity + delta, 99))

    // Cập nhật Store
    updateQuantityStore(sku, newQty)

    // Cập nhật LocalStorage đồng bộ với Store
    const updated = items.map((i) =>
      i.sku === sku ? { ...i, quantity: newQty } : i,
    )
    sessionStorage.setItem('cart', JSON.stringify(updated))
  }

  // 3. Remove single item
  const removeItem = (sku: string) => {
    const updated = items.filter((i) => i.sku !== sku)
    sessionStorage.setItem('cart', JSON.stringify(updated))
    removeItemStore(sku)
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng')
  }

  // 4. Remove multiple items
  const removeMultipleItems = (skus: string[]) => {
    const updated = items.filter((i) => !skus.includes(i.sku))
    sessionStorage.setItem('cart', JSON.stringify(updated))

    // Giả sử store của bạn có hàm removeMultiple hoặc lặp qua từng cái
    skus.forEach((sku) => removeItemStore(sku))
    toast.success(`Đã xóa ${skus.length} sản phẩm`)
  }

  // 5. Compute selected items and total
  // Sử dụng (items || []) để phòng thủ cực đoan
  const selectedItems = items.filter((i) => selectedSkus.includes(i.sku))

  const totalPrice = selectedItems.reduce(
    (sum, i) => sum + (i.skuPrice || i.basePrice || 0) * i.quantity,
    0,
  )

  return {
    items,
    selectedItems,
    selectedSkus,
    toggleItemSelection,
    loading: false, // Bạn có thể kết nối với state loading từ useInitCart nếu cần
    updateQuantity,
    removeItem,
    removeMultipleItems,
    totalPrice,
  }
};
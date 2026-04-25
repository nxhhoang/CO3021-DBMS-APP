import { useMemo } from 'react';
import { CartItem } from '@/types/cart.types';

function useCartSelectors(items: CartItem[], selectedSkus: string[]) {
  // Lọc ra các item đang được tích chọn (Checkbox)
  const selectedItems = useMemo(
    () => items.filter((item) => selectedSkus.includes(item.sku)),
    [items, selectedSkus],
  )

  // Tính tổng tiền dựa trên skuPrice
  const totalPrice = useMemo(
    () =>
      selectedItems.reduce((sum, item) => {
        // Sử dụng skuPrice thay vì unitPrice
        // Thêm || 0 để phòng trường hợp data mock/api bị thiếu field
        const price = item.skuPrice || 0
        return sum + price * item.quantity
      }, 0),
    [selectedItems],
  )

  return { selectedItems, totalPrice }
}

export default useCartSelectors
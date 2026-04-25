import { useEffect, useState } from 'react';
import { CartItem } from '@/types'

function useInitCart(setItems: (items: CartItem[]) => void) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const rawData = sessionStorage.getItem('cart')
      if (!rawData) {
        setItems([])
        return
      }

      const localData = JSON.parse(rawData)

      // Đồng nhất dữ liệu: luôn lấy mảng
      const cartItems = Array.isArray(localData)
        ? localData
        : localData.items || []

      setItems(cartItems)
    } catch (error) {
      console.error('Failed to init cart:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [setItems])

  return { loading }
}

export default useInitCart;

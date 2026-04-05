import { useEffect, useState } from 'react';
import { cartService } from '@/services/cart.service';

function useInitCart(setItems: any) {
  const [loading, setLoading] = useState(true);

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
    }
  }, [setItems])

  return { loading }
}

export default useInitCart;

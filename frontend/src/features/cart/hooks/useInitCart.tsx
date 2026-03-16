import { useEffect, useState } from 'react';
import { cartService } from '@/services/cart.service';

function useInitCart(setItems: any) {
  const [loading, setLoading] = useState(true);

  const isLoggedIn =
    typeof window !== 'undefined' && !!localStorage.getItem('accessToken');

  useEffect(() => {
    const initCart = async () => {
      setLoading(true);

      try {
        const localData = JSON.parse(localStorage.getItem('cart') || '[]');

        if (isLoggedIn) {
          const response = await cartService.syncCart({ items: localData });

          setItems(response.data?.items ?? []);
          localStorage.removeItem('cart');
        } else {
          setItems(localData);
        }
      } catch (error) {
        console.error('Failed to init cart:', error);
      } finally {
        setLoading(false);
      }
    };

    initCart();
  }, [isLoggedIn, setItems]);

  return { loading, isLoggedIn };
}

export default useInitCart;

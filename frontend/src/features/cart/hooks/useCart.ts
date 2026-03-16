'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { cartService } from '@/services/cart.service';

export const useCart = () => {
  const items = useCartStore((s) => s.items);
  const selectedSkus = useCartStore((s) => s.selectedSkus);

  const setItems = useCartStore((s) => s.setItems);
  const updateQuantityStore = useCartStore((s) => s.updateQuantity);
  const removeItemStore = useCartStore((s) => s.removeItem);
  const toggleItemSelection = useCartStore((s) => s.toggleItemSelection);

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

  const updateQuantity = (sku: string, delta: number) => {
    const item = items.find((i) => i.sku === sku);
    if (!item) return;

    const newQty = Math.max(
      1,
      Math.min(item.quantity + delta, item.stockQuantity),
    );

    updateQuantityStore(sku, newQty);

    if (!isLoggedIn) {
      const updated = items.map((i) =>
        i.sku === sku ? { ...i, quantity: newQty } : i,
      );
      localStorage.setItem('cart', JSON.stringify(updated));
    }
  };

  const removeItem = (sku: string) => {
    removeItemStore(sku);

    if (!isLoggedIn) {
      const updated = items.filter((i) => i.sku !== sku);
      localStorage.setItem('cart', JSON.stringify(updated));
    }
  };

  // chỉ lấy items được chọn
  const selectedItems = useMemo(
    () => items.filter((item) => selectedSkus.includes(item.sku)),
    [items, selectedSkus],
  );

  // tính tổng tiền chỉ dựa trên selectedItems
  const totalPrice = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0,
      ),
    [selectedItems],
  );

  return {
    items,
    selectedItems,
    selectedSkus,
    toggleItemSelection,
    loading,
    updateQuantity,
    removeItem,
    totalPrice,
  };
};

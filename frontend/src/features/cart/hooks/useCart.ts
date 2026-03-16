'use client';

import { useCartStore } from '@/store/cartStore';
import useInitCart from './useInitCart';
import useCartSelectors from './useCartSelectors';

export const useCart = () => {
  const items = useCartStore((s) => s.items);
  const selectedSkus = useCartStore((s) => s.selectedSkus);

  const setItems = useCartStore((s) => s.setItems);
  const updateQuantityStore = useCartStore((s) => s.updateQuantity);
  const removeItemStore = useCartStore((s) => s.removeItem);
  const toggleItemSelection = useCartStore((s) => s.toggleItemSelection);

  const { loading, isLoggedIn } = useInitCart(setItems);
  const { selectedItems, totalPrice } = useCartSelectors(items, selectedSkus);

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
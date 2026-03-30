import { useMemo } from 'react';
import { CartItem } from '@/types/cart.types';

function useCartSelectors(items: CartItem[], selectedSkus: string[]) {
  const selectedItems = useMemo(
    () => items.filter((item) => selectedSkus.includes(item.sku)),
    [items, selectedSkus],
  );

  const totalPrice = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0,
      ),
    [selectedItems],
  );

  return { selectedItems, totalPrice };
}

export default useCartSelectors;

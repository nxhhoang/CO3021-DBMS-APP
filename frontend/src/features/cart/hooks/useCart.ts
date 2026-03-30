'use client';

import { useCartStore } from '@/store/cartStore';
import useInitCart from './useInitCart';
import useCartSelectors from './useCartSelectors';
import { toast } from 'sonner';
import { cartService } from '@/services/cart.service';

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

  const removeItem = async (sku: string) => {
    try {
      if (isLoggedIn) {
        // CALL API TẠI ĐÂY
        await cartService.removeCartItem(sku);
      } else {
        // Xử lý LocalStorage cho khách
        const updated = items.filter((i) => i.sku !== sku);
        localStorage.setItem('cart', JSON.stringify(updated));
      }

      // Cuối cùng luôn cập nhật UI thông qua Store
      removeItemStore(sku);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      toast.error('Không thể xóa sản phẩm. Vui lòng thử lại.');
      // Có thể fetch lại giỏ hàng từ server nếu cần đồng bộ lại
    }
  };
  const removeMultipleItems = async (skus: string[]) => {
    // Thực hiện xóa đồng loạt trong Store và LocalStorage/API
    for (const sku of skus) {
      await removeItem(sku); // Tận dụng hàm removeItem có sẵn của bạn
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
    removeMultipleItems,
  };
};
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { orderService } from '@/services/order.service';
import { addressService } from '@/services/address.service';
import { PAYMENT_METHOD } from '@/constants/enum';
import { CartItem } from '@/types/cart.types';
import { Address, PaymentMethod } from '@/types';
import { useCartStore } from '@/store/cartStore'

export const useCheckout = (selectedItems: CartItem[]) => {
  const items = useCartStore((s) => s.items)
  const removeMultipleItemsStore = useCartStore((s) => s.removeMultipleItems)

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PAYMENT_METHOD.COD,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [orderID, setOrderID] = useState<number | null>(null);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [dialogState, setDialogState] = useState({
    confirm: false,
    success: false,
  });

  // Lấy địa chỉ mặc định
  const fetchDefaultAddress = useCallback(async () => {
    try {
      setIsAddressLoading(true);
      const res = await addressService.getAddresses();
      if (res.data && res.data.length > 0) {
        const addr = res.data.find((a) => a.isDefault);
        setDefaultAddress(addr || res.data[0]);
      }
    } catch (error) {
      console.error('Fetch address error:', error);
    } finally {
      setIsAddressLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDefaultAddress();
  }, [fetchDefaultAddress]);

  // Xử lý thanh toán
  const handleCheckout = async () => {
    if (!defaultAddress) return toast.error('Vui lòng chọn địa chỉ giao hàng');

    try {
      setIsLoading(true);
      // ✅ QUAN TRỌNG: Reset orderID cũ để tránh cache giao diện thành công
      setOrderID(null);

      const payload = {
        shippingAddressId: defaultAddress.addressID,
        paymentMethod,
        items: selectedItems.map((item) => ({
          productId: item.productId || item.productID,
          productName: item.productName,
          sku: item.sku,
          quantity: item.quantity,
          unitPrice: item.skuPrice || item.basePrice,
        })),
      }

      const res = await orderService.createOrder(payload);

      if (res.data) {
        const skusToRemove = selectedItems.map((item) => item.sku);
        const nextItems = items.filter(
          (item) => !skusToRemove.includes(item.sku),
        )

        removeMultipleItemsStore(skusToRemove)
        sessionStorage.setItem('cart', JSON.stringify({ items: nextItems }))
        window.dispatchEvent(
          new CustomEvent('cart:updated', {
            detail: {
              totalItems: nextItems.reduce(
                (sum, item) => sum + item.quantity,
                0,
              ),
            },
          }),
        )

        // Cập nhật ID mới và mở Dialog thành công
        setOrderID(res.data.orderID);
        setDialogState({ confirm: false, success: true });
        toast.success('Đặt hàng thành công');
      }
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Lỗi đặt hàng';

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // States
    paymentMethod,
    isLoading,
    isAddressLoading,
    orderID,
    defaultAddress,
    dialogState,

    // Setters
    setPaymentMethod,
    setDialogState,
    setOrderID,

    // Methods
    handleCheckout,
    refreshAddress: fetchDefaultAddress,
  };
};

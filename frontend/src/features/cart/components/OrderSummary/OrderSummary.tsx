'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import formatVND from '@/features/cart/utils/formatVND';
import { OrderItemsList } from './OrderItemsList';
import { CheckoutDialogs } from '../Checkout/CheckoutDialog';
import { useCheckout } from '../../hooks/useCheckout';
import { CartItem } from '@/types/cart.types';

interface OrderSummaryProps {
  selectedItems: CartItem[];
  totalPrice: number;
}

const OrderSummary = ({ selectedItems, totalPrice }: OrderSummaryProps) => {
  const {
    paymentMethod,
    setPaymentMethod,
    isLoading,
    isAddressLoading,
    orderID,
    setOrderID,
    dialogState,
    setDialogState,
    handleCheckout,
    defaultAddress,
  } = useCheckout(selectedItems)

  const hasItems = selectedItems.length > 0;

  return (
    <div className="h-fit lg:sticky lg:top-24">
      <Card className="overflow-hidden border-2 shadow-md transition-all hover:shadow-lg">
        <div className="bg-primary/5 border-b px-6 py-4">
          <h3 className="flex items-center gap-2 text-lg font-bold">
            <ShoppingBag className="h-5 w-5" /> Hóa đơn
          </h3>
        </div>

        <CardContent className="p-6">
          {hasItems ? (
            <div className="animate-in fade-in space-y-4 duration-500">
              <div>
                <p className="text-muted-foreground mb-2 text-sm font-semibold">
                  Sản phẩm đã chọn ({selectedItems.length})
                </p>
                <div className="custom-scrollbar max-h-75 overflow-y-auto pr-2">
                  <OrderItemsList items={selectedItems} />
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="text-muted-foreground flex items-center justify-between italic">
                  <span className="text-sm">Tạm tính</span>
                  <span className="text-sm">{formatVND(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">Tổng cộng</span>
                  <p className="text-primary text-2xl font-black tracking-tight">
                    {formatVND(totalPrice)}
                  </p>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() =>
                  setDialogState((prev) => ({ ...prev, confirm: true }))
                }
                className="shadow-primary/20 mt-4 w-full text-base font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Tiến hành thanh toán
              </Button>
            </div>
          ) : (
            <div className="animate-in zoom-in-95 flex flex-col items-center gap-3 py-10 text-center duration-300">
              <div className="bg-muted rounded-full p-4">
                <ShoppingBag className="text-muted-foreground h-8 w-8" />
              </div>
              <p className="text-muted-foreground font-medium">
                {dialogState.success
                  ? 'Đang chuyển hướng...'
                  : 'Chưa có sản phẩm nào'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <CheckoutDialogs
        state={dialogState}
        setState={setDialogState}
        isLoading={isLoading}
        isAddressLoading={isAddressLoading}
        address={defaultAddress}
        onConfirm={handleCheckout}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        selectedItems={selectedItems}
        totalPrice={totalPrice}
        orderID={orderID}
        setOrderID={setOrderID} // Truyền xuống để Dialog có thể reset trạng thái đơn hàng
      />
    </div>
  )
};

export default OrderSummary;
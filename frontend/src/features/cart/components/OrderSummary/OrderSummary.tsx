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
  const selectedUnits = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  )

  return (
    <div className="h-fit lg:sticky lg:top-24">
      <Card className="rounded-[2.5rem] border-white/40 bg-white/40 shadow-xl shadow-slate-200/50 backdrop-blur-3xl transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/60 dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <div className="border-b border-white/40 px-8 py-6 dark:border-white/10">
          <div className="flex items-center gap-3">
             <div className="h-2 w-6 rounded-full bg-blue-600" />
             <h3 className="font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
               Tóm tắt
             </h3>
          </div>
        </div>

        <CardContent className="p-8">
          {hasItems ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <p className="font-display text-[11px] font-black tracking-widest text-slate-400 uppercase">
                     Chi tiết sản phẩm
                   </p>
                   <span className="rounded-full bg-slate-900 px-3 py-1 font-mono text-[9px] font-bold text-white dark:bg-white dark:text-slate-900">
                     {selectedItems.length} mẫu
                   </span>
                </div>
                <div className="custom-scrollbar max-h-[300px] overflow-y-auto pr-3">
                  <OrderItemsList items={selectedItems} />
                </div>
              </div>

              <div className="space-y-4 border-t border-white/40 pt-8 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-display text-[11px] font-black tracking-widest text-slate-400 uppercase">Tạm tính</span>
                  <span className="font-mono text-sm font-black text-slate-900 dark:text-white">
                    {formatVND(totalPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    Tổng cộng
                  </span>
                  <div className="text-right">
                    <p className="font-mono text-3xl font-black tracking-tighter text-blue-600 dark:text-blue-400">
                      {formatVND(totalPrice)}
                    </p>
                    <p className="mt-1 font-display text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      VAT INCLUDED
                    </p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                disabled={!hasItems}
                onClick={() =>
                  setDialogState((prev) => ({ ...prev, confirm: true }))
                }
                className="group relative h-16 w-full overflow-hidden rounded-full bg-slate-900 text-sm font-black tracking-[0.2em] text-white uppercase transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] dark:bg-white dark:text-slate-900"
              >
                <span className="relative z-10">
                  {hasItems
                    ? 'Thanh toán ngay'
                    : 'Chọn sản phẩm'}
                </span>
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-blue-600 to-cyan-500 transition-transform duration-500 group-hover:translate-x-0" />
              </Button>
            </div>
          ) : (
            <div className="animate-in zoom-in-95 flex flex-col items-center gap-6 py-16 text-center duration-500">
              <div className="bg-slate-100/50 flex h-24 w-24 items-center justify-center rounded-full dark:bg-slate-800/50">
                <ShoppingBag className="h-10 w-10 text-slate-400" />
              </div>
              <div className="space-y-2">
                <p className="font-display text-xl font-black text-slate-900 dark:text-white">
                  {dialogState.success
                    ? 'Đang chuẩn bị...'
                    : 'Hóa đơn trống'}
                </p>
                <p className="text-muted-foreground mx-auto max-w-[200px] text-xs font-medium leading-relaxed">
                  Vui lòng chọn sản phẩm để xem tính toán chi tiết.
                </p>
              </div>
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
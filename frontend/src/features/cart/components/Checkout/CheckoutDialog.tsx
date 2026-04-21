import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ShieldCheck,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { OrderItemsList } from '../OrderSummary/OrderItemsList';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import formatVND from '@/features/cart/utils/formatVND';
import { useRouter } from 'next/navigation';
import { Address, CartItem, PaymentMethod } from '@/types'
import { Dispatch, SetStateAction } from 'react'

type CheckoutDialogState = { confirm: boolean; success: boolean }

interface Props {
  state: CheckoutDialogState
  setState: Dispatch<SetStateAction<CheckoutDialogState>>
  isLoading: boolean
  isAddressLoading: boolean
  address: Address | null
  onConfirm: () => void
  paymentMethod: PaymentMethod
  setPaymentMethod: (val: PaymentMethod) => void
  selectedItems: CartItem[]
  totalPrice: number
  orderID: number | null
  setOrderID: (id: number | null) => void
}

export const CheckoutDialogs = ({
  state,
  setState,
  isLoading,
  isAddressLoading,
  address,
  onConfirm,
  paymentMethod,
  setPaymentMethod,
  selectedItems,
  totalPrice,
  orderID,
  setOrderID,
}: Props) => {
  const router = useRouter();

  const handleCloseSuccess = () => {
    setState((prev) => ({ ...prev, success: false }))
    setOrderID(null);
  };

  return (
    <>
      {/* Dialog Xác nhận */}
      <Dialog
        open={state.confirm}
        onOpenChange={(v) => setState((prev) => ({ ...prev, confirm: v }))}
      >
        <DialogContent className="max-w-xl overflow-hidden border-none bg-white/90 p-0 shadow-3xl backdrop-blur-3xl sm:rounded-[3rem] dark:bg-slate-900/90">
          <DialogHeader className="border-b border-slate-100 p-10 dark:border-white/5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20">
                <ShieldCheck className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <DialogTitle className="font-display text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Xác nhận thanh toán
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-10 px-10 py-10">
            {/* Địa chỉ thực tế từ API */}
            <div className="rounded-[2rem] border border-slate-100 bg-slate-50/50 p-8 dark:border-white/5 dark:bg-slate-800/50">
              <div className="mb-6 flex items-center gap-3 font-display text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">
                <MapPin className="h-4 w-4" /> Địa chỉ giao hàng
              </div>

              {isAddressLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <p className="font-display text-[10px] font-black uppercase tracking-widest text-slate-400">Đang tải...</p>
                </div>
              ) : address ? (
                <div className="animate-in fade-in duration-700">
                  <p className="font-display text-xl font-black text-slate-900 dark:text-white">
                    {address.addressName}
                  </p>
                  <p className="mt-2 text-base font-medium text-slate-500 dark:text-slate-400">
                    {`${address.addressLine}, ${address.district}, ${address.city}`}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 py-2 text-sm font-bold text-rose-500 uppercase tracking-widest">
                  <AlertCircle className="h-5 w-5" />
                  <span>Thiếu thông tin địa chỉ</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="h-1 w-4 rounded-full bg-slate-200" />
                  <p className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">Sản phẩm thanh toán</p>
               </div>
              <div className="custom-scrollbar max-h-48 overflow-y-auto rounded-[2rem] border border-slate-100 bg-white/50 p-6 dark:border-white/5 dark:bg-slate-800/50">
                <OrderItemsList items={selectedItems} />
              </div>
            </div>

            <PaymentMethodSelector
              selected={paymentMethod}
              onChange={setPaymentMethod}
            />

            <div className="flex items-center justify-between border-t border-slate-100 pt-8 dark:border-white/5">
              <div className="space-y-1">
                 <p className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">Tổng cộng thanh toán</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Đã bao gồm phí dịch vụ</p>
              </div>
              <span className="font-mono text-4xl font-black tracking-tighter text-blue-600 dark:text-blue-400">
                {formatVND(totalPrice)}
              </span>
            </div>
          </div>

          <DialogFooter className="border-t border-slate-100 bg-slate-50/50 p-10 dark:border-white/10 dark:bg-slate-800/50">
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-end">
              <Button
                variant="ghost"
                onClick={() => setState({ ...state, confirm: false })}
                className="h-14 rounded-full px-8 font-display text-[11px] font-black tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-100 dark:hover:bg-white/5"
              >
                Hủy bỏ
              </Button>
              <Button
                className="group relative h-14 min-w-[220px] overflow-hidden rounded-full bg-slate-900 px-10 font-display text-[11px] font-black tracking-[0.2em] text-white uppercase transition-all hover:scale-[1.05] active:scale-95 dark:bg-white dark:text-slate-900"
                disabled={isLoading || !address}
                onClick={onConfirm}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Xác nhận đơn hàng'
                  )}
                </span>
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-blue-600 to-cyan-500 transition-transform duration-500 group-hover:translate-x-0" />
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Thành công */}
      <Dialog
        open={state.success}
        onOpenChange={(v) => {
          if (!v) handleCloseSuccess()
        }}
      >
        <DialogContent className="max-w-md overflow-hidden border-none bg-white/95 p-0 shadow-3xl backdrop-blur-3xl sm:rounded-[3rem] dark:bg-slate-900/95">
          <div className="flex flex-col items-center p-12 text-center">
            <div className="relative mb-10">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" strokeWidth={2.5} />
              </div>
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/10" />
            </div>
            
            <div className="space-y-4">
              <DialogTitle className="font-display text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Đặt hàng thành công!
              </DialogTitle>
              <p className="text-base font-medium leading-relaxed text-slate-500">
                Cảm ơn bạn đã tin tưởng. Đơn hàng của bạn đã được chuyển tới bộ phận xử lý và sẽ sớm được giao tới địa chỉ của bạn.
              </p>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
               <p className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">Mã đơn hàng định danh</p>
               <div className="inline-flex items-center gap-3 rounded-2xl bg-blue-50 px-6 py-3 font-mono text-sm font-black text-blue-600 dark:bg-blue-900/30">
                 #{orderID}
               </div>
            </div>
          </div>

          <DialogFooter className="bg-slate-50/50 p-10 dark:bg-slate-800/50">
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                variant="outline"
                className="h-14 rounded-full border-slate-200 px-8 font-display text-[11px] font-black tracking-widest text-slate-600 uppercase transition-all hover:bg-white dark:border-white/10 dark:text-slate-400"
                onClick={handleCloseSuccess}
              >
                Tiếp tục mua sắm
              </Button>
              <Button
                className="h-14 rounded-full bg-slate-900 px-10 font-display text-[11px] font-black tracking-[0.2em] text-white uppercase transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-slate-900"
                onClick={() => {
                  handleCloseSuccess()
                  router.push('/user/orders')
                }}
              >
                Xem chi tiết đơn hàng
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
};

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
        <DialogContent className="flex max-h-[90vh] max-w-xl flex-col overflow-hidden border-none bg-white/95 p-0 shadow-2xl backdrop-blur-3xl sm:rounded-3xl dark:bg-slate-900/95">
          <DialogHeader className="shrink-0 border-b border-slate-100 p-6 dark:border-white/5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <DialogTitle className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Xác nhận thanh toán
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex-1 space-y-8 overflow-y-auto p-6 sm:p-8">
            {/* Địa chỉ */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-white/5 dark:bg-slate-800/50">
              <div className="font-display mb-4 flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                <MapPin className="h-3.5 w-3.5" /> Địa chỉ giao hàng
              </div>

              {isAddressLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    Đang tải...
                  </p>
                </div>
              ) : address ? (
                <div className="animate-in fade-in duration-300">
                  <p className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    {address.addressName}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                    {`${address.addressLine}, ${address.district}, ${address.city}`}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 py-1 text-[11px] font-bold tracking-widest text-rose-500 uppercase">
                  <AlertCircle className="h-4 w-4" />
                  <span>Thiếu thông tin địa chỉ</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-3 rounded-full bg-slate-200" />
                <p className="font-display text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Sản phẩm thanh toán
                </p>
              </div>
              <div className="custom-scrollbar max-h-40 overflow-y-auto rounded-2xl border border-slate-100 bg-white/50 p-4 dark:border-white/5 dark:bg-slate-800/50">
                <OrderItemsList items={selectedItems} />
              </div>
            </div>

            <PaymentMethodSelector
              selected={paymentMethod}
              onChange={setPaymentMethod}
            />

            <div className="flex items-center justify-between border-t border-slate-100 pt-6 dark:border-white/5">
              <p className="font-display text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Tổng thanh toán
              </p>
              <span className="font-mono text-3xl font-black tracking-tighter text-blue-600 dark:text-blue-400">
                {formatVND(totalPrice)}
              </span>
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t border-slate-100 bg-slate-50/50 p-6 dark:border-white/10 dark:bg-slate-800/50">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="ghost"
                onClick={() => setState({ ...state, confirm: false })}
                className="font-display h-12 rounded-xl px-6 text-[11px] font-bold tracking-wider text-slate-500 uppercase hover:bg-slate-100 dark:hover:bg-white/5"
              >
                Hủy bỏ
              </Button>
              <Button
                type="button"
                className="btn-premium-primary group relative h-12 min-w-50 overflow-hidden rounded-xl"
                disabled={isLoading || !address}
                onClick={() => {
                  console.log('[CheckoutDialog] Confirm button clicked')
                  onConfirm()
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-[11px] font-bold tracking-wider uppercase">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Xác nhận đơn hàng'
                  )}
                </span>
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-blue-600 to-cyan-500 transition-transform duration-300 group-hover:translate-x-0" />
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
        <DialogContent className="max-w-md overflow-hidden border-none bg-white/95 p-0 shadow-2xl backdrop-blur-3xl sm:rounded-3xl dark:bg-slate-900/95">
          <div className="flex flex-col items-center p-8 text-center sm:p-10">
            <div className="relative mb-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/10" />
            </div>

            <div className="space-y-3">
              <DialogTitle className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Đặt hàng thành công!
              </DialogTitle>
              <p className="text-sm leading-relaxed font-medium text-slate-500">
                Đơn hàng của bạn đã được chuyển tới bộ phận xử lý và sẽ sớm được
                giao tới địa chỉ của bạn.
              </p>
            </div>

            <div className="mt-6 flex flex-col items-center gap-2">
              <p className="font-display text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                Mã đơn hàng
              </p>
              <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 font-mono text-sm font-bold text-blue-600 dark:bg-blue-900/30">
                #{orderID}
              </div>
            </div>
          </div>

          <DialogFooter className="bg-slate-50/50 p-6 dark:bg-slate-800/50">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                variant="outline"
                className="font-display h-12 rounded-xl border-slate-200 px-6 text-[10px] font-bold tracking-wider text-slate-600 uppercase hover:bg-white dark:border-white/10 dark:text-slate-400"
                onClick={handleCloseSuccess}
              >
                Tiếp tục
              </Button>
              <Button
                className="font-display h-12 rounded-xl bg-slate-900 px-8 text-[10px] font-bold tracking-wider text-white uppercase transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-slate-900"
                onClick={() => {
                  handleCloseSuccess()
                  router.push('/user/orders')
                }}
              >
                Xem đơn hàng
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
};

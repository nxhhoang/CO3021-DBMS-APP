'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { OrderItemsList } from './OrderItemsList'
import { CheckoutDialogs, useCheckout } from '@/features/cart'
import { CartItem, Address, PaymentMethod } from '@/types'

interface OrderSummaryProps {
  selectedItems: CartItem[]
  totalPrice: number
  // Lifted checkout props
  paymentMethod: PaymentMethod
  setPaymentMethod: (val: PaymentMethod) => void
  isLoading: boolean
  isAddressLoading: boolean
  orderID: number | null
  setOrderID: (id: number | null) => void
  dialogState: { confirm: boolean; success: boolean }
  setDialogState: React.Dispatch<React.SetStateAction<{ confirm: boolean; success: boolean }>>
  defaultAddress: Address | null
  checkoutError: string | null
  setCheckoutError: (val: string | null) => void
}

const OrderSummary = ({
  selectedItems,
  totalPrice,
  paymentMethod,
  setPaymentMethod,
  isLoading,
  isAddressLoading,
  orderID,
  setOrderID,
  dialogState,
  setDialogState,
  defaultAddress,
  checkoutError,
  setCheckoutError,
}: OrderSummaryProps) => {
  const hasItems = selectedItems.length > 0
  const selectedUnits = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  )

  return (
    <div className="h-fit lg:sticky lg:top-24">
      <Card className="glass-card">
        <div className="border-b border-white/40 px-6 py-4 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-1 w-4 rounded-full bg-blue-600" />
            <h3 className="font-display text-xl font-bold tracking-tight text-slate-900 uppercase dark:text-white">
              Hóa đơn
            </h3>
          </div>
        </div>

        <CardContent className="p-5">
          {hasItems ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4 duration-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-display text-[10px] font-bold tracking-[0.1em] text-slate-400 uppercase">
                    Sản phẩm chọn lọc
                  </p>
                  <span className="badge-count-premium">
                    {selectedItems.length}
                  </span>
                </div>
                <div className="custom-scrollbar max-h-[220px] overflow-y-auto pr-2">
                  <OrderItemsList items={selectedItems} />
                </div>
              </div>

              <div className="space-y-3 border-t border-white/40 pt-4 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-display text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Tạm tính
                  </span>
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-white">
                    Tổng cộng
                  </span>
                  <div className="text-right">
                    <p className="font-mono text-xl font-black tracking-tighter text-blue-600 dark:text-blue-400">
                      {formatPrice(totalPrice)}
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
                className="btn-premium-primary group relative h-12 w-full overflow-hidden rounded-xl"
              >
                <span className="relative z-10 text-[10px] font-bold tracking-[0.1em] uppercase">
                  Tiến hành thanh toán
                </span>
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-blue-600 to-cyan-500 transition-transform duration-300 group-hover:translate-x-0" />
              </Button>
            </div>
          ) : (
            <div className="animate-in zoom-in-95 flex flex-col items-center gap-4 py-10 text-center duration-500">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100/50 dark:bg-slate-800/50">
                <ShoppingBag className="h-8 w-8 text-slate-400" />
              </div>
              <div className="space-y-1">
                <p className="font-display text-lg font-black text-slate-900 dark:text-white">
                  {dialogState.success ? 'Đang chuẩn bị...' : 'Hóa đơn trống'}
                </p>
                <p className="text-muted-foreground mx-auto max-w-[180px] text-[11px] leading-relaxed font-medium">
                  Vui lòng chọn sản phẩm để xem tính toán chi tiết.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export { OrderSummary }

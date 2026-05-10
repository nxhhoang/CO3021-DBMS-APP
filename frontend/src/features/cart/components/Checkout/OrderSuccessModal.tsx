'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface OrderSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  orderID: number | string | null
}

export const OrderSuccessModal = ({
  isOpen,
  onClose,
  orderID,
}: OrderSuccessModalProps) => {
  const router = useRouter()

  const handleGoToOrders = () => {
    onClose()
    router.push('/user/orders')
  }

  const handleContinueShopping = () => {
    onClose()
    router.push('/products')
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md overflow-hidden border-none bg-white p-0 shadow-xl sm:rounded-3xl dark:bg-slate-900">
        <div className="flex flex-col items-center p-8 text-center sm:p-10">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
            className="relative mb-8"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-white/10"
            >
              <Package className="h-5 w-5 text-blue-600" />
            </motion.div>
          </motion.div>

          <div className="space-y-4">
            <DialogTitle className="font-display text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Đặt hàng thành công!
            </DialogTitle>
            <p className="text-base leading-relaxed font-medium text-slate-500">
              Cảm ơn bạn đã tin tưởng. Đơn hàng của bạn đang được chúng tôi
              chuẩn bị và sẽ sớm được giao tới bạn.
            </p>
          </div>

          <div className="mt-8 w-full space-y-6">
            <div className="flex flex-col items-center gap-2">
              <p className="font-display text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Mã đơn hàng của bạn
              </p>
              <div className="relative inline-flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 px-6 py-3 font-mono text-lg font-black text-blue-600 dark:border-blue-500/20 dark:bg-blue-900/30">
                <span className="text-blue-400">#</span>
                {orderID}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/30 px-5 py-2.5 dark:border-emerald-500/10 dark:bg-emerald-900/10">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white">
                  <CheckCircle2 size={16} />
                </div>
                <div className="text-left">
                  <p className="font-display text-[10px] font-black tracking-widest text-emerald-600 uppercase">
                    Trạng thái
                  </p>
                  <p className="text-[12px] font-bold text-slate-900 dark:text-white">
                    Đã tiếp nhận đơn hàng
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-slate-50 p-6 dark:bg-slate-800/50">
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="font-display group h-14 flex-1 rounded-2xl border-slate-200 bg-white px-6 text-[11px] font-black tracking-widest text-slate-600 uppercase transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400"
              onClick={handleContinueShopping}
            >
              <ShoppingBag className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              Tiếp tục mua sắm
            </Button>
            <Button
              className="btn-premium-primary group h-14 flex-1 rounded-2xl px-6 text-[11px] font-black tracking-widest text-white uppercase transition-all"
              onClick={handleGoToOrders}
            >
              Xem đơn hàng
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

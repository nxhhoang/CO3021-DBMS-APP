import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ShieldCheck,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Home,
  QrCode,
  ArrowLeft,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { OrderItemsList } from '../OrderSummary/OrderItemsList'
import { PaymentMethodSelector } from './PaymentMethodSelector'
import { formatPrice } from '@/lib/utils'
import { Address, CartItem, PaymentMethod } from '@/types'
import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { OrderSuccessModal } from './OrderSuccessModal'
import { addressService } from '@/services/address.service'

type CheckoutDialogState = { confirm: boolean; success: boolean }

interface Props {
  state: CheckoutDialogState
  setState: Dispatch<SetStateAction<CheckoutDialogState>>
  isLoading: boolean
  isAddressLoading: boolean
  address: Address | null
  setAddress: (addr: Address) => void
  onConfirm: () => void
  paymentMethod: PaymentMethod
  setPaymentMethod: (val: PaymentMethod) => void
  selectedItems: CartItem[]
  totalPrice: number
  orderID: number | null
  setOrderID: (id: number | null) => void
  checkoutError?: string | null
  onClearError?: () => void
  isPaymentProcessing: boolean
  setIsPaymentProcessing: (val: boolean) => void
  onConfirmPayment: () => void
}

export const CheckoutDialogs = ({
  state,
  setState,
  isLoading,
  isAddressLoading,
  address,
  setAddress,
  onConfirm,
  paymentMethod,
  setPaymentMethod,
  selectedItems,
  totalPrice,
  orderID,
  setOrderID,
  checkoutError,
  onClearError,
  isPaymentProcessing,
  setIsPaymentProcessing,
  onConfirmPayment,
}: Props) => {
  const [isChangingAddress, setIsChangingAddress] = useState(false)
  const [addressList, setAddressList] = useState<Address[]>([])
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)

  const handleCloseSuccess = () => {
    setState((prev) => ({ ...prev, success: false }))
    setOrderID(null)
  }

  const handleOpenAddressList = async () => {
    try {
      setIsLoadingAddresses(true)
      setIsChangingAddress(true)
      const res = await addressService.getAddresses()
      setAddressList(res.data || [])
    } catch (error) {
      console.error('Failed to load addresses:', error)
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  const handleSelectAddress = (addr: Address) => {
    setAddress(addr)
    setIsChangingAddress(false)
  }

  useEffect(() => {
    if (!state.confirm) {
      setIsChangingAddress(false)
    }
  }, [state.confirm])

  return (
    <>
      <Dialog
        open={state.confirm}
        onOpenChange={(v) => setState((prev) => ({ ...prev, confirm: v }))}
      >
        <DialogContent className="modal-premium-content h-[680px] w-full overflow-hidden p-0 sm:max-w-5xl sm:rounded-[32px]">
          <DialogHeader className="modal-premium-header border-none bg-white py-6 dark:bg-slate-900">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/10">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="modal-premium-title">
                  {isPaymentProcessing 
                    ? 'Quét mã thanh toán' 
                    : isChangingAddress 
                    ? 'Chọn địa chỉ nhận hàng' 
                    : 'Xác nhận thanh toán'}
                </DialogTitle>
                <p className="modal-premium-subtitle">
                  {isPaymentProcessing
                    ? 'Vui lòng thực hiện chuyển khoản theo mã QR bên dưới'
                    : isChangingAddress 
                    ? 'Hãy chọn địa chỉ bạn muốn nhận hàng' 
                    : 'Vui lòng kiểm tra lại thông tin đơn hàng trước khi hoàn tất'}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="grid h-[calc(680px-100px)] grid-cols-1 overflow-hidden lg:grid-cols-12">
            {/* Cột Trái: Sản phẩm, Địa chỉ hoặc QR */}
            <div className="custom-scrollbar relative overflow-hidden lg:col-span-7 lg:border-r lg:border-slate-100 dark:lg:border-white/5">
              <AnimatePresence mode="wait">
                {isPaymentProcessing ? (
                  <motion.div
                    key="qr-panel"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="h-full space-y-6 p-8"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-3 rounded-full bg-blue-600" />
                        <p className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          Thanh toán đơn hàng #{orderID}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsPaymentProcessing(false)}
                        className="h-auto p-0 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600"
                      >
                        <ArrowLeft className="mr-1 h-3 w-3" /> Quay lại
                      </Button>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-6 py-4">
                      <div className="group relative">
                        <div className="absolute -inset-4 animate-pulse rounded-[40px] bg-blue-500/5 blur-2xl transition-all group-hover:bg-blue-500/10" />
                        <div className="relative rounded-[32px] border border-slate-100 bg-white p-8 shadow-2xl shadow-blue-500/5 dark:border-white/5 dark:bg-slate-800">
                          <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900">
                            <QrCode className="h-32 w-32 text-slate-900 dark:text-white" />
                          </div>
                          <div className="mt-4 text-center">
                            <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                              Quét để thanh toán
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-full max-w-sm space-y-4">
                        <div className="rounded-2xl bg-blue-50 p-4 dark:bg-blue-900/20">
                          <div className="flex flex-col gap-1 text-center">
                            <span className="text-[10px] font-bold text-blue-600/60 uppercase tracking-wider">Số tiền cần thanh toán</span>
                            <span className="font-display text-2xl font-black text-blue-600">
                              {formatPrice(totalPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : isChangingAddress ? (
                  <motion.div
                    key="address-panel"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="space-y-4 p-8"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-sm font-bold uppercase tracking-widest text-slate-400">
                        Danh sách địa chỉ
                      </h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsChangingAddress(false)}
                        className="h-auto p-0 text-[10px] font-bold uppercase tracking-widest text-blue-600"
                      >
                        Quay lại đơn hàng
                      </Button>
                    </div>
                    
                    {isLoadingAddresses ? (
                      <div className="flex flex-col gap-3">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
                      </div>
                    ) : addressList.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        {addressList.map((addr) => (
                          <button
                            key={addr.addressID}
                            onClick={() => handleSelectAddress(addr)}
                            className={`group flex w-full flex-col gap-1 rounded-2xl border-2 p-5 text-left transition-all ${
                              address?.addressID === addr.addressID
                                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/5'
                                : 'border-slate-50 bg-white hover:border-slate-200 dark:border-white/5 dark:bg-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-display text-sm font-bold text-slate-900 dark:text-white">
                                {addr.addressName}
                              </p>
                              {addr.isDefault && (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:bg-emerald-900/30">
                                  MẶC ĐỊNH
                                </span>
                              )}
                            </div>
                            <p className="text-[12px] font-medium leading-relaxed text-slate-500 line-clamp-2">
                              {`${addr.addressLine}, ${addr.district}, ${addr.city}`}
                            </p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 text-center">
                        <p className="text-sm text-slate-400">Không tìm thấy địa chỉ nào trong hồ sơ của bạn</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="products-panel"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="space-y-4 p-8"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-3 rounded-full bg-blue-600" />
                        <p className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          Sản phẩm trong đơn hàng
                        </p>
                      </div>
                      <div className="glass-badge scale-90 px-3 py-1 text-[9px]">
                        {selectedItems.length} ITEMS
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/10 p-6 dark:border-white/5 dark:bg-slate-800/30">
                      <OrderItemsList items={selectedItems} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cột Phải: Địa chỉ, Thanh toán & Tổng tiền */}
            <div className="flex flex-col bg-slate-50/30 p-8 dark:bg-white/5 lg:col-span-5">
              <div className="flex-1 space-y-6">
                {/* Địa chỉ (Đã chuyển từ trái sang phải) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-4 rounded-full bg-slate-200" />
                    <p className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Địa chỉ nhận hàng
                    </p>
                  </div>
                  <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 transition-all hover:border-blue-100 dark:border-white/5 dark:bg-slate-800/50">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        <MapPin className="h-3.5 w-3.5 text-blue-500" /> Chi tiết
                      </div>
                      {(!isChangingAddress && !isPaymentProcessing) && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={handleOpenAddressList}
                          className="h-auto p-0 text-[10px] font-black tracking-widest text-blue-600 uppercase"
                        >
                          Thay đổi <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    {isAddressLoading ? (
                      <div className="flex items-center gap-3 py-1">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <Skeleton className="h-5 w-32 rounded-lg" />
                      </div>
                    ) : address ? (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                        <div className="flex items-center gap-2">
                          <p className="font-display text-base font-black text-slate-900 dark:text-white">
                            {address.addressName}
                          </p>
                          {address.isDefault && (
                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
                              <Home className="h-2.5 w-2.5" />
                            </div>
                          )}
                        </div>
                        <p className="mt-1 text-[12px] font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                          {`${address.addressLine}, ${address.district}, ${address.city}`}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 py-1 text-[11px] font-black tracking-widest text-rose-500 uppercase">
                        <AlertCircle className="h-4 w-4" />
                        <span>Chưa chọn địa chỉ</span>
                      </div>
                    )}
                  </div>
                </div>

                <PaymentMethodSelector
                  selected={paymentMethod}
                  onChange={setPaymentMethod}
                  disabled={isPaymentProcessing}
                />

                <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 text-white shadow-md dark:bg-blue-600">
                  <div className="relative z-10 space-y-1">
                    <p className="text-[10px] font-black tracking-[0.2em] text-white/60 uppercase">
                      Tổng thanh toán
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-3xl font-black tracking-tighter">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 space-y-4">
                {checkoutError && (
                  <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-[11px] font-bold text-rose-600 animate-in fade-in zoom-in-95 dark:border-rose-900/30 dark:bg-rose-950/30">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{checkoutError}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (isPaymentProcessing) {
                        setIsPaymentProcessing(false)
                      } else {
                        setState({ ...state, confirm: false })
                        onClearError?.()
                      }
                    }}
                    className="h-12 rounded-xl text-[10px] font-black tracking-widest text-slate-500 uppercase transition-all hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-white/5"
                  >
                    {isPaymentProcessing ? 'Quay lại' : 'Hủy bỏ'}
                  </Button>
                  <Button
                    type="button"
                    className="btn-premium-primary group relative h-12 overflow-hidden rounded-xl bg-blue-600 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    disabled={isLoading || (!isPaymentProcessing && (!address || isChangingAddress))}
                    onClick={isPaymentProcessing ? onConfirmPayment : onConfirm}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 text-[10px] font-black tracking-widest uppercase text-white">
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isPaymentProcessing ? (
                        <>
                          Đã thanh toán
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </>
                      ) : (
                        <>
                          Xác nhận
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </>
                      )}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Thành công */}
      <OrderSuccessModal
        isOpen={state.success}
        onClose={handleCloseSuccess}
        orderID={orderID}
      />
    </>
  )
}


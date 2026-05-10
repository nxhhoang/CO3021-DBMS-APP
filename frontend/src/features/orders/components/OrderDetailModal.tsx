'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Package,
  Calendar,
  CreditCard,
  Hash,
  Loader2,
  MessageSquarePlus,
  X,
  Eye,
} from 'lucide-react'
import { orderService } from '@/services/order.service'
import { OrderDetail } from '@/types'
import { formatPrice } from '@/lib/utils'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { OrderStatusBadge } from './order-status-badge'
import { cn } from '@/lib/utils'
import { ReviewSubmitModal } from './ReviewSubmitModal'

interface Props {
  orderId: number | null
  isOpen: boolean
  onClose: () => void
}

export const OrderDetailModal = ({ orderId, isOpen, onClose }: Props) => {
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Review State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviewingProduct, setReviewingProduct] = useState<{
    id: string
    name: string
  } | null>(null)

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetail(orderId)
    } else {
      setOrder(null)
      setError(null)
    }
  }, [isOpen, orderId])

  const fetchOrderDetail = async (id: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await orderService.getOrderDetail(id)
      if (response && response.data) {
        setOrder(response.data)
      } else {
        setError('Không tìm thấy thông tin đơn hàng.')
      }
    } catch (err: any) {
      console.error('Failed to fetch order detail:', err)
      setError('Đã có lỗi xảy ra khi tải thông tin đơn hàng.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenReview = (productId: string, productName: string) => {
    setReviewingProduct({ id: productId, name: productName })
    setIsReviewModalOpen(true)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          showCloseButton={false}
          className="flex h-[600px] w-full max-w-[95vw] flex-col overflow-hidden border border-slate-200 bg-white p-0 shadow-2xl sm:rounded-3xl lg:max-w-5xl dark:bg-slate-900"
        >
          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn-premium"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <DialogHeader className="shrink-0 border-b border-slate-100 p-6 pr-20 dark:border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Chi tiết đơn hàng
                  </DialogTitle>
                  <p className="font-mono text-xs font-bold text-blue-600">
                    #{orderId}
                  </p>
                </div>
              </div>
              {order && (
                <div className="flex flex-col items-end gap-1 animate-in fade-in duration-500">
                  <OrderStatusBadge status={order.status} />
                  <div className="flex items-center gap-1.5 opacity-60">
                    <Calendar size={10} className="text-slate-400" />
                    <p className="font-mono text-[10px] font-bold tracking-tight text-slate-500">
                      {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', {
                        locale: vi,
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="custom-scrollbar flex-1 overflow-y-auto p-5 sm:p-6">
            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-40 w-full rounded-2xl" />
                <Skeleton className="h-40 w-full rounded-2xl" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-rose-50 p-4 dark:bg-rose-900/20">
                  <X className="h-8 w-8 text-rose-500" />
                </div>
                <p className="font-medium text-slate-500">{error}</p>
                <Button
                  variant="outline"
                  onClick={() => orderId && fetchOrderDetail(orderId)}
                  className="mt-4 rounded-xl"
                >
                  Thử lại
                </Button>
              </div>
            ) : order ? (
              <div className="animate-in fade-in duration-500">
                <div className="space-y-5">
                  {/* Product Items */}
                  <div className="flex items-center gap-3">
                    <div className="h-px w-8 bg-linear-to-r from-blue-600 to-transparent" />
                    <p className="font-display text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">
                      Danh sách sản phẩm
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-white/50 p-5 dark:border-white/5 dark:bg-slate-800/50">
                    <div className="space-y-6">
                      {order.items.map((item, idx) => (
                        <div
                          key={`${item.sku}-${idx}`}
                          className="group space-y-4"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-1 items-start gap-4 overflow-hidden">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-mono text-sm font-black text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                                {item.quantity}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-display truncate text-[15px] font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white">
                                  {item.productName}
                                </p>
                                <p className="mt-0.5 font-mono text-[10px] font-medium tracking-tighter text-slate-400 uppercase">
                                  SKU: {item.sku}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-mono text-[14px] font-black tracking-tighter text-slate-900 dark:text-white">
                                {formatPrice(item.unitPrice * item.quantity)}
                              </p>
                              <p className="font-mono text-[11px] font-bold text-slate-400">
                                {formatPrice(item.unitPrice)}{' '}
                                <span className="text-slate-300">x{item.quantity}</span>
                              </p>
                            </div>
                          </div>

                          {/* Review Button - Only if Delivered */}
                          {order.status === 'DELIVERED' && (
                            <div className="flex justify-end pt-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleOpenReview(
                                    item.productId,
                                    item.productName,
                                  )
                                }
                                className={cn(
                                  'font-display h-8 rounded-full px-4 text-[9px] font-bold tracking-widest uppercase transition-all',
                                  item.isReviewed
                                    ? 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-900 hover:text-white dark:border-white/10 dark:bg-white/5'
                                    : 'border-blue-100 bg-blue-50/30 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-500/20 dark:bg-blue-500/10',
                                )}
                              >
                                {item.isReviewed ? (
                                  <>
                                    <Eye className="mr-1.5 h-3 w-3" />
                                    Xem đánh giá
                                  </>
                                ) : (
                                  <>
                                    <MessageSquarePlus className="mr-1.5 h-3 w-3" />
                                    Viết đánh giá
                                  </>
                                )}
                              </Button>
                            </div>
                          )}

                          {idx < order.items.length - 1 && (
                            <div className="border-b border-slate-100 pt-2 dark:border-white/5" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <DialogFooter className="shrink-0 border-t border-slate-100 bg-white p-6 sm:px-8 dark:border-white/10 dark:bg-slate-900">
            <div className="flex w-full flex-row items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <p className="font-display text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                    Thanh toán
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[13px] font-bold text-slate-900 dark:text-white">
                      {(() => {
                        switch (order?.payment?.method) {
                          case 'E_WALLET':
                            return 'Ví điện tử'
                          case 'BANKING':
                            return 'Chuyển khoản'
                          case 'COD':
                            return 'Tiền mặt'
                          default:
                            return order?.payment?.method || '...'
                        }
                      })()}
                    </span>
                    {order && (
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[8px] font-black tracking-widest uppercase ring-1 ring-inset',
                          order.payment?.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-600 ring-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/20'
                            : 'bg-amber-50 text-amber-600 ring-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-400/20',
                        )}
                      >
                        {order.payment?.status === 'COMPLETED'
                          ? 'Đã xong'
                          : 'Chờ xử lý'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="font-display text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                  Tổng thanh toán
                </p>
                <span className="font-mono text-4xl font-black tracking-tighter text-blue-600 dark:text-blue-400">
                  {order ? formatPrice(order.totalAmount) : '...'}
                </span>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ReviewSubmitModal
        productId={reviewingProduct?.id || null}
        productName={reviewingProduct?.name || null}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </>
  )
}

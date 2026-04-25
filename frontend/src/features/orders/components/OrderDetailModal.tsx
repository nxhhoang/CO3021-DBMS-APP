'use client';

import { useEffect, useState } from 'react';
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
  Package,
  Calendar,
  CreditCard,
  Hash,
  Loader2,
  X,
  ChevronRight,
  ShieldCheck,
  MessageSquarePlus,
} from 'lucide-react';
import { orderService } from '@/services/order.service';
import { OrderDetail } from '@/types';
import formatVND from '@/features/cart/utils/formatVND';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { OrderStatusBadge } from './order-status-badge';
import { cn } from '@/lib/utils';
import { ReviewSubmitModal } from './ReviewSubmitModal';

interface Props {
  orderId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailModal = ({ orderId, isOpen, onClose }: Props) => {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Review State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingProduct, setReviewingProduct] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetail(orderId);
    } else {
      setOrder(null);
      setError(null);
    }
  }, [isOpen, orderId]);

  const fetchOrderDetail = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await orderService.getOrderDetail(id);
      if (response && response.data) {
        setOrder(response.data);
      } else {
        setError('Không tìm thấy thông tin đơn hàng.');
      }
    } catch (err: any) {
      console.error('Failed to fetch order detail:', err);
      setError('Đã có lỗi xảy ra khi tải thông tin đơn hàng.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenReview = (productId: string, productName: string) => {
    setReviewingProduct({ id: productId, name: productName });
    setIsReviewModalOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-hidden border-none bg-white/95 p-0 shadow-2xl backdrop-blur-3xl flex flex-col sm:rounded-3xl dark:bg-slate-900/95">
          <DialogHeader className="border-b border-slate-100 p-6 dark:border-white/5 shrink-0">
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
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-8">
            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-40 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
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
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                {/* Status & Date Card */}
                <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 dark:border-white/5 dark:bg-slate-800/50">
                  <div className="space-y-1.5">
                    <p className="flex items-center gap-2 font-display text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <Hash className="h-3 w-3" /> Trạng thái
                    </p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="space-y-1.5">
                    <p className="flex items-center gap-2 font-display text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <Calendar className="h-3 w-3" /> Ngày đặt
                    </p>
                    <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                      {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                    </p>
                  </div>
                </div>

                {/* Items Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-3 rounded-full bg-blue-600" />
                    <p className="font-display text-[10px] font-bold tracking-wider text-slate-400 uppercase">Danh sách sản phẩm</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-white/50 p-4 dark:border-white/5 dark:bg-slate-800/50">
                    <div className="space-y-6">
                      {order.items.map((item, idx) => (
                        <div key={`${item.sku}-${idx}`} className="group space-y-3">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-1 items-start gap-3 overflow-hidden">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-mono text-xs font-black text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                                {item.quantity}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-display text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                  {item.productName}
                                </p>
                                <p className="font-mono text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
                                  SKU: {item.sku}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-mono text-[13px] font-black tracking-tighter text-slate-900 dark:text-white">
                                {formatVND(item.unitPrice * item.quantity)}
                              </p>
                              <p className="font-mono text-[10px] text-slate-400">
                                {formatVND(item.unitPrice)} / cái
                              </p>
                            </div>
                          </div>
                          
                          {/* Review Button - Only if Delivered */}
                          {order.status === 'DELIVERED' && (
                            <div className="flex justify-end pt-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenReview(item.productId, item.productName)}
                                className="h-8 rounded-full border-blue-100 bg-blue-50/30 px-4 font-display text-[9px] font-bold tracking-widest uppercase text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-500/20 dark:bg-blue-500/10"
                              >
                                <MessageSquarePlus className="mr-1.5 h-3 w-3" />
                                Viết đánh giá
                              </Button>
                            </div>
                          )}
                          
                          {idx < order.items.length - 1 && (
                            <div className="border-b border-slate-100 dark:border-white/5 pt-1" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              {/* Payment Section */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2">
                    <div className="h-0.5 w-3 rounded-full bg-blue-600" />
                    <p className="font-display text-[10px] font-bold tracking-wider text-slate-400 uppercase">Thanh toán</p>
                 </div>
                 <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-white/5 dark:bg-slate-800/50">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-700">
                             <CreditCard className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                             <p className="font-display text-sm font-bold text-slate-900 dark:text-white">
                                {order.payment?.method || 'Chưa xác định'}
                             </p>
                             <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">
                                Phương thức
                             </p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className={cn(
                             "text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ring-1",
                             order.payment?.status === 'PAID' 
                                ? "bg-emerald-50 text-emerald-600 ring-emerald-200/50" 
                                : "bg-amber-50 text-amber-600 ring-amber-200/50"
                          )}>
                             {order.payment?.status || 'PENDING'}
                          </p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Total Section */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-8 dark:border-white/5">
                <div>
                  <p className="font-display text-[10px] font-bold tracking-wider text-slate-400 uppercase">Tổng giá trị đơn hàng</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 uppercase tracking-widest">
                    <ShieldCheck className="h-3.5 w-3.5" /> Giao dịch bảo mật
                  </p>
                </div>
                <span className="font-mono text-3xl font-black tracking-tighter text-blue-600 dark:text-blue-400">
                  {formatVND(order.totalAmount)}
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter className="border-t border-slate-100 bg-slate-50/50 p-6 dark:border-white/10 dark:bg-slate-800/50 shrink-0">
          <Button
            onClick={onClose}
            className="w-full h-12 rounded-xl bg-slate-900 font-display text-[11px] font-bold tracking-widest text-white uppercase transition-all hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-900"
          >
            Đóng cửa sổ
          </Button>
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
  );
};


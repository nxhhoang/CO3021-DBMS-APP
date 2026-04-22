'use client';

import { useEffect, useState } from 'react';
import {
  Package,
  Eye,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from '@/features/orders/components/order-status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { orderService } from '@/services/order.service';
import type { Order } from '@/types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getOrders();
        if (response && response.data) {
          setOrders(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const processingOrders = orders.filter((o) => o.status === 'PROCESSING' || o.status === 'PENDING');
  const historyOrders = orders.filter((o) => o.status !== 'PROCESSING' && o.status !== 'PENDING');

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 space-y-10 duration-700">
      <Tabs defaultValue="current" className="w-full space-y-10">
        <TabsList className="glass-container-full h-16 w-full max-w-md p-2">
          <TabsTrigger 
            value="current" 
            className="h-full flex-1 rounded-full font-display text-[11px] font-black tracking-widest uppercase transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            Đang thực hiện ({processingOrders.length})
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="h-full flex-1 rounded-full font-display text-[11px] font-black tracking-widest uppercase transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            Lịch sử ({historyOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {processingOrders.map((order) => (
            <OrderCard key={order.orderID} order={order} />
          ))}
          {processingOrders.length === 0 && <EmptyOrderState />}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {historyOrders.map((order) => (
            <OrderCard key={order.orderID} order={order} />
          ))}
          {historyOrders.length === 0 && <EmptyOrderState />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const formattedDate = format(new Date(order.createdAt), 'dd MMMM, yyyy', { locale: vi });
  const formattedAmount = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(order.totalAmount);

  return (
    <div className="glass-card group relative p-8">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-slate-900 text-white shadow-2xl transition-transform duration-500 group-hover:scale-110">
            <Package size={28} strokeWidth={2.5} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-black tracking-tighter text-blue-600">
                #{order.orderID}
              </span>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="font-sans text-sm font-bold text-slate-500 italic">
              Đặt ngày: <span className="font-mono text-slate-900 not-italic">{formattedDate}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">Tổng cộng</p>
            <p className="font-mono text-2xl font-black tracking-tighter text-slate-900">
              {formattedAmount}
            </p>
          </div>
          <Button 
            className="btn-premium-primary h-14 px-8"
          >
            <Eye className="mr-2 h-4 w-4" strokeWidth={2.5} />
            Chi tiết
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmptyOrderState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white/20 py-24 backdrop-blur-md">
      <div className="relative mb-8">
        <Package className="h-20 w-20 text-slate-200" />
        <div className="absolute inset-0 animate-pulse bg-blue-500/10 blur-[40px] rounded-full" />
      </div>
      <h3 className="font-display text-xl font-black text-slate-900">Trống trải quá...</h3>
      <p className="mt-2 font-medium text-slate-400 leading-relaxed">
        Bạn chưa có đơn hàng nào trong danh sách này.
      </p>
      <Button 
        variant="link" 
        className="mt-6 font-display text-[11px] font-black tracking-widest text-blue-600 uppercase hover:text-blue-700"
      >
        <Search className="mr-2 h-4 w-4" strokeWidth={2.5} />
        Khám phá cửa hàng ngay
      </Button>
    </div>
  );
}

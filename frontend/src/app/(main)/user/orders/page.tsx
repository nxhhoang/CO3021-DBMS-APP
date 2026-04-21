import {
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { OrderStatusBadge } from '@/features/orders/components/order-status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function OrdersPage() {
  // Giả lập dữ liệu đơn hàng
  const orders = [
    {
      id: 'ORD-9921',
      date: '2026-02-28',
      total: '2,450,000đ',
      status: 'PROCESSING', // Đang xử lý
      items: ['Bàn phím cơ AKKO 3087', 'Chuột Logitech G304'],
    },
    {
      id: 'ORD-8812',
      date: '2026-02-15',
      total: '15,200,000đ',
      status: 'DELIVERED', // Đã giao
      items: ['iPhone 13 128GB - Blue'],
    },
    {
      id: 'ORD-7705',
      date: '2026-01-10',
      total: '450,000đ',
      status: 'CANCELLED', // Đã hủy
      items: ['Cáp sạc USB-C to Lightning'],
    },
  ];

  const processingOrders = orders.filter((o) => o.status === 'PROCESSING');

  const historyOrders = orders.filter((o) => o.status !== 'PROCESSING');

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      {/* Background System */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-[10%] left-[10%] h-[600px] w-[600px] rounded-full bg-blue-400/10 blur-[120px] dark:bg-blue-900/20" />
        <div className="absolute -bottom-[10%] right-[10%] h-[600px] w-[600px] rounded-full bg-cyan-400/10 blur-[120px] dark:bg-cyan-900/20" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      </div>

      <div className="mx-auto max-w-5xl space-y-12">
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <div className="h-1.5 w-8 rounded-full bg-blue-600" />
            <h4 className="font-display text-[11px] font-black tracking-[0.2em] text-blue-600 uppercase">
              Quản lý tài khoản
            </h4>
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Đơn hàng của tôi
          </h1>
          <p className="max-w-2xl text-base font-medium text-slate-500 leading-relaxed">
            Theo dõi hành trình đơn hàng và xem lại lịch sử mua sắm của bạn trên toàn hệ thống.
          </p>
        </div>

        <Tabs defaultValue="current" className="w-full space-y-10">
          <TabsList className="h-16 w-full max-w-md rounded-full border border-white/40 bg-white/40 p-2 shadow-xl shadow-slate-200/50 backdrop-blur-3xl dark:border-white/10 dark:bg-slate-900/40">
            <TabsTrigger 
              value="current" 
              className="h-full flex-1 rounded-full font-display text-[11px] font-black tracking-widest uppercase transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-900"
            >
              Đang thực hiện ({processingOrders.length})
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="h-full flex-1 rounded-full font-display text-[11px] font-black tracking-widest uppercase transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-900"
            >
              Lịch sử ({historyOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="animate-in fade-in slide-in-from-bottom-6 space-y-6 duration-700">
            {processingOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
            {processingOrders.length === 0 && <EmptyOrderState />}
          </TabsContent>

          <TabsContent value="history" className="animate-in fade-in slide-in-from-bottom-6 space-y-6 duration-700">
            {historyOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
            {historyOrders.length === 0 && <EmptyOrderState />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function OrderCard({ order }: any) {
  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/40 p-8 shadow-xl shadow-slate-200/50 transition-all duration-500 backdrop-blur-3xl hover:shadow-2xl hover:shadow-slate-200/60 dark:border-white/10 dark:bg-slate-900/40">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-slate-900 text-white shadow-2xl dark:bg-white dark:text-slate-900">
            <Package size={28} strokeWidth={2.5} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-black tracking-tighter text-blue-600 dark:text-blue-400">
                #{order.id}
              </span>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="font-sans text-sm font-bold text-slate-500 italic">
              Đặt ngày: <span className="font-mono text-slate-900 dark:text-white not-italic">{order.date}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">Tổng cộng</p>
            <p className="font-mono text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
              {order.total}
            </p>
          </div>
          <Button 
            className="h-14 rounded-full bg-slate-900 px-8 font-display text-[11px] font-black tracking-[0.2em] text-white uppercase transition-all hover:scale-[1.05] active:scale-95 dark:bg-white dark:text-slate-900"
          >
            <Eye className="mr-2 h-4 w-4" strokeWidth={2.5} />
            Chi tiết
          </Button>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-100 pt-6 dark:border-white/5">
        <div className="flex items-center gap-3">
           <div className="h-1 w-4 rounded-full bg-slate-200" />
           <p className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">Sản phẩm bao gồm</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {order.items.map((item: string, i: number) => (
            <span 
              key={i} 
              className="rounded-full border border-slate-100 bg-white/60 px-4 py-2 font-display text-[10px] font-black text-slate-600 backdrop-blur-md dark:border-white/5 dark:bg-slate-800/40 dark:text-slate-400"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyOrderState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/30 py-24 dark:border-white/10 dark:bg-white/5">
      <div className="relative mb-8">
        <Package className="h-20 w-20 text-slate-200 dark:text-slate-800" />
        <div className="absolute inset-0 animate-pulse bg-blue-500/10 blur-[40px] rounded-full" />
      </div>
      <h3 className="font-display text-xl font-black text-slate-900 dark:text-white">Trống trải quá...</h3>
      <p className="mt-2 font-medium text-slate-400 leading-relaxed">
        Bạn chưa có đơn hàng nào trong danh sách này.
      </p>
      <Button 
        variant="link" 
        className="mt-6 font-display text-[11px] font-black tracking-widest text-blue-600 uppercase hover:text-blue-700"
      >
        Khám phá cửa hàng ngay
      </Button>
    </div>
  );
}

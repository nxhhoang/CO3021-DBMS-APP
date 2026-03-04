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
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h3 className="text-lg font-medium">Đơn hàng của tôi</h3>
        <p className="text-muted-foreground text-sm">
          {' '}
          Theo dõi trạng thái và xem lại lịch sử mua sắm của bạn.
        </p>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="current">Đang xử lý</TabsTrigger>
          <TabsTrigger value="history">Lịch sử đơn hàng</TabsTrigger>
        </TabsList>

        {/* Tab Đơn hàng hiện tại */}
        <TabsContent value="current" className="space-y-4">
          {processingOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
          {processingOrders.length === 0 && <EmptyOrderState />}
        </TabsContent>

        {/* Tab Lịch sử */}
        <TabsContent value="history" className="space-y-4">
          {historyOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Component phụ cho từng dòng đơn hàng
function OrderCard({ order, getStatusBadge }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-bold">{order.id}</CardTitle>
          <CardDescription>Ngày đặt: {order.date}</CardDescription>
        </div>
        <OrderStatusBadge status={order.status} />
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground text-sm">
          <p className="text-foreground mb-1 font-medium">Sản phẩm:</p>
          <ul className="list-inside list-disc">
            {order.items.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="mt-2 flex items-center justify-between border-t pt-4">
        <div className="text-sm">
          Tổng cộng: <span className="text-lg font-bold">{order.total}</span>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="h-4 w-4" /> Chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
}

function EmptyOrderState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-20">
      <Package className="text-muted-foreground mb-4 h-12 w-12 opacity-20" />
      <p className="text-muted-foreground font-medium">
        Bạn không có đơn hàng nào đang xử lý.
      </p>
      <Button variant="link" className="text-primary mt-2">
        Tiếp tục mua sắm
      </Button>
    </div>
  );
}

import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

type OrderStatus = 'PROCESSING' | 'DELIVERED' | 'CANCELLED';

interface Props {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: Props) {
  switch (status) {
    case 'PROCESSING':
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <Clock className="mr-1 h-3 w-3" />
          Đang xử lý
        </Badge>
      );

    case 'DELIVERED':
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Đã giao
        </Badge>
      );

    case 'CANCELLED':
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <XCircle className="mr-1 h-3 w-3" />
          Đã hủy
        </Badge>
      );

    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

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
        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 ring-1 ring-blue-200/50 dark:bg-blue-900/20 dark:ring-blue-500/20">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          <span className="font-display text-[10px] font-black tracking-widest text-blue-600 uppercase dark:text-blue-400">
            Đang xử lý
          </span>
        </div>
      );

    case 'DELIVERED':
      return (
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 ring-1 ring-emerald-200/50 dark:bg-emerald-900/20 dark:ring-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="font-display text-[10px] font-black tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
            Đã giao
          </span>
        </div>
      );

    case 'CANCELLED':
      return (
        <div className="flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 ring-1 ring-rose-200/50 dark:bg-rose-900/20 dark:ring-rose-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
          <span className="font-display text-[10px] font-black tracking-widest text-rose-600 uppercase dark:text-rose-400">
            Đã hủy
          </span>
        </div>
      );

    default:
      return (
        <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200/50 dark:bg-slate-900/20 dark:ring-slate-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          <span className="font-display text-[10px] font-black tracking-widest text-slate-500 uppercase">
            {status}
          </span>
        </div>
      );
  }
}

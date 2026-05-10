import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle2, XCircle, Truck, AlertCircle } from 'lucide-react'
import { OrderStatus } from '@/types/order.types'
import { getOrderStatusStyle } from '@/constants/enum'
import { cn } from '@/lib/utils'

interface Props {
  status: OrderStatus
}

export function OrderStatusBadge({ status }: Props) {
  const style = getOrderStatusStyle(status)

  const getIcon = () => {
    switch (status) {
      case 'PENDING':
        return <Clock size={12} className="animate-pulse" />
      case 'PROCESSING':
        return (
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        )
      case 'SHIPPED':
        return <Truck size={12} />
      case 'DELIVERED':
        return <CheckCircle2 size={12} />
      case 'CANCELLED':
        return <XCircle size={12} />
      default:
        return <AlertCircle size={12} />
    }
  }

  // Map status to specific Tailwind classes for reliability
  const variantClasses: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-700 ring-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-400/20',
    PROCESSING: 'bg-blue-50 text-blue-700 ring-blue-200/50 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-400/20',
    SHIPPED: 'bg-blue-50 text-blue-700 ring-blue-200/50 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-400/20',
    DELIVERED: 'bg-emerald-50 text-emerald-700 ring-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/20',
    CANCELLED: 'bg-red-50 text-red-700 ring-red-200/50 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-400/20',
  }

  const currentClasses = variantClasses[status] || 'bg-slate-50 text-slate-700 ring-slate-200/50 dark:bg-slate-500/10 dark:text-slate-400 dark:ring-slate-400/20'

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1 ring-inset',
        currentClasses,
      )}
    >
      <div className="flex h-3 w-3 shrink-0 items-center justify-center">
        {getIcon()}
      </div>
      <span className="font-display text-[10px] font-black tracking-widest uppercase">
        {style.label}
      </span>
    </div>
  )
}

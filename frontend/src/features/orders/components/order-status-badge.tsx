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

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-full px-3 py-1 ring-1 ring-inset',
        style.bgColor,
        style.textColor,
        style.textColor.replace('text-', 'ring-').replace('700', '200') + '/50', // Dynamic ring color
        'dark:bg-opacity-20',
      )}
    >
      {getIcon()}
      <span className="font-display text-[10px] font-black tracking-widest uppercase">
        {style.label}
      </span>
    </div>
  )
}

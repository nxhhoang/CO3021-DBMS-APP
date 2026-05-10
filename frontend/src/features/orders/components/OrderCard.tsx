'use client'

import { Package, Eye, Calendar, Tag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { OrderStatusBadge } from './order-status-badge'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { Order } from '@/types'

interface Props {
  order: Order
  onViewDetail: (id: number) => void
}

export function OrderCard({ order, onViewDetail }: Props) {
  const formattedDate = format(new Date(order.createdAt), 'dd MMMM, yyyy', {
    locale: vi,
  })
  const formattedAmount = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(order.totalAmount)

  return (
    <Card
      className="group relative overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-blue-400 hover:shadow-md active:scale-[0.99] dark:border-slate-800 dark:bg-slate-900"
      onClick={() => onViewDetail(order.orderID)}
    >
      <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          {/* Icon Container */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800">
            <Package size={20} strokeWidth={2.5} />
          </div>

          {/* Info Section */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-base font-black tracking-tighter text-blue-600">
                #{order.orderID}
              </span>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar size={13} className="text-slate-400" />
                <span className="font-mono text-[12px] font-bold text-slate-900 dark:text-slate-200">
                  {formattedDate}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Tag size={13} className="text-slate-400" />
                <span className="font-display text-[9px] font-black tracking-widest text-slate-400 uppercase">
                  Đơn hàng
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Amount & Action Section */}
        <div className="flex flex-row items-center justify-between gap-6 border-t border-slate-100 pt-4 sm:flex-row sm:border-none sm:pt-0">
          <div className="sm:text-right">
            <p className="font-display text-[9px] font-black tracking-widest text-slate-400 uppercase">
              Tổng cộng
            </p>
            <p className="font-mono text-xl font-black tracking-tighter text-slate-900 dark:text-white">
              {formattedAmount}
            </p>
          </div>

          <Button
            className="h-10 rounded-xl bg-slate-900 px-6 font-display text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetail(order.orderID)
            }}
          >
            <Eye className="mr-2 h-4 w-4" strokeWidth={2.5} />
            Chi tiết
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

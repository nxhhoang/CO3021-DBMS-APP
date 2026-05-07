'use client'
import React from 'react'
import { ShoppingBag, LayoutDashboard, CircleDot } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import AnimatedNumber from '@/components/common/AnimatedNumber'

interface SummaryStatusCard {
  status: string
  label: string
  count: number
  textColor: string
  bgColor: string
  accentClass: string
}

interface SummaryCardProps {
  totalOrders: number
  statusCounts: SummaryStatusCard[]
}

const SummaryCard = ({ totalOrders, statusCounts }: SummaryCardProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
      {/* TOTAL ORDERS CARD - Dashboard Style */}
      <Card className="card-premium border-none bg-white shadow-sm dark:bg-slate-900/50">
        <CardContent className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100 dark:bg-blue-900/20 dark:text-blue-400">
                  <ShoppingBag size={14} strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  Tổng đơn hàng
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-mono text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
                  <AnimatedNumber value={totalOrders} />
                  <span className="ml-2 text-xs font-bold text-slate-400 uppercase">
                    đơn
                  </span>
                </h3>
                <p className="text-[10px] font-bold tracking-tight text-slate-400">
                  Toàn bộ dữ liệu hệ thống
                </p>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              <LayoutDashboard size={24} strokeWidth={2.5} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* STATUS ANALYSIS - Premium Grid Style */}
      <Card className="card-premium border-none bg-slate-50/40 dark:bg-slate-900/20">
        <CardContent className="px-6 py-5">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-500">
              <CircleDot size={12} strokeWidth={3} />
            </div>
            <span className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
              Trạng thái
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {statusCounts.map((item) => (
              <div 
                key={item.status}
                className={cn(
                  "relative overflow-hidden rounded-xl border p-3 transition-all",
                  "border-white/40 dark:border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]",
                  item.bgColor,
                  "dark:bg-slate-800/40"
                )}
              >
                <div className="relative z-10">
                  <p className="text-[9px] font-black tracking-wider text-slate-500 uppercase opacity-70">
                    {item.label}
                  </p>
                  <div className={cn("mt-1.5 font-mono text-xl font-black tracking-tighter", item.textColor)}>
                    <AnimatedNumber value={item.count} />
                  </div>
                </div>
                {/* Subtle decorative dot */}
                <div className={cn("absolute -right-1 -top-1 h-6 w-6 rounded-full blur-xl opacity-20", 
                  item.status === 'PENDING' ? 'bg-amber-500' :
                  item.status === 'PROCESSING' ? 'bg-blue-500' :
                  item.status === 'SHIPPED' ? 'bg-sky-500' :
                  item.status === 'DELIVERED' ? 'bg-green-500' : 'bg-red-500'
                )} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default React.memo(SummaryCard)

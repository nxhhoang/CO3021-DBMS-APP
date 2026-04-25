'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SummaryStatusCard {
  status: string
  label: string
  count: number
  textColor: string
  accentClass: string
}

interface SummaryCardProps {
  totalOrders: number
  statusCounts: SummaryStatusCard[]
}

const SummaryCard = ({
  totalOrders,
  statusCounts,
}: SummaryCardProps) => {
  return (
    <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-[250px_minmax(0,1fr)]">
      <Card className="group relative overflow-hidden rounded-2xl border-none bg-slate-900 p-4 text-white shadow-md">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-4 rounded-full bg-blue-500" />
            <p className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">
              TỔNG ĐƠN HÀNG
            </p>
          </div>
          <div>
            <div className="font-mono text-4xl font-black tracking-tighter text-blue-400">
              {totalOrders.toLocaleString()}
            </div>
            <p className="mt-0.5 font-display text-sm font-bold text-slate-300">
              Đơn hàng hệ thống
            </p>
          </div>
        </div>
        {/* Decorative element */}
        <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl transition-all group-hover:bg-blue-500/10" />
      </Card>

      <Card className="rounded-2xl border-slate-200 bg-white p-4 shadow-md dark:border-white/10 dark:bg-slate-900/50 dark:shadow-none">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-1 w-4 rounded-full bg-cyan-500" />
          <p className="font-display text-[10px] font-black tracking-widest text-slate-500 uppercase">
            PHÂN TÍCH TRẠNG THÁI
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {statusCounts.map((item) => (
            <div
              key={item.status}
              className="group rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:border-blue-200 dark:border-white/5 dark:bg-slate-800/30"
            >
              <p className="font-display text-[9px] font-black tracking-widest text-slate-400 uppercase">
                {item.label}
              </p>
              <div className={`mt-1.5 font-mono text-xl font-black tracking-tighter ${item.textColor}`}>
                {item.count.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default React.memo(SummaryCard)

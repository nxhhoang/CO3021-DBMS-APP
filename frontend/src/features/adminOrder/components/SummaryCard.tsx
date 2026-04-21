'use client'

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

export default function SummaryCard({
  totalOrders,
  statusCounts,
}: SummaryCardProps) {
  return (
    <div className="mb-10 grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <Card className="group relative overflow-hidden rounded-[2.5rem] border-none bg-slate-900 p-8 text-white shadow-2xl">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-6 rounded-full bg-blue-400" />
            <p className="font-display text-[11px] font-black tracking-widest text-slate-400 uppercase">
              TỔNG ĐƠN HÀNG
            </p>
          </div>
          <div>
            <div className="font-mono text-6xl font-black tracking-tighter text-blue-400">
              {totalOrders.toLocaleString()}
            </div>
            <p className="mt-2 font-display text-lg font-bold text-slate-300">
              Đơn hàng hệ thống
            </p>
          </div>
          <p className="text-sm leading-relaxed text-slate-500">
            Dữ liệu tổng hợp từ toàn bộ các kênh bán hàng hiện có.
          </p>
        </div>
        {/* Decorative element */}
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-blue-500/10 blur-[50px] transition-all group-hover:bg-blue-500/20" />
      </Card>

      <Card className="rounded-[2.5rem] border-white/40 bg-white/40 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-3xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <div className="mb-8 flex items-center gap-2">
          <div className="h-1.5 w-6 rounded-full bg-cyan-500" />
          <p className="font-display text-[11px] font-black tracking-widest text-slate-400 uppercase">
            PHÂN TÍCH TRẠNG THÁI
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {statusCounts.map((item) => (
            <div
              key={item.status}
              className="group rounded-3xl border border-slate-100 bg-white p-5 transition-all hover:scale-105 hover:shadow-lg dark:border-white/5 dark:bg-slate-800/50"
            >
              <p className="font-display text-[10px] font-black tracking-widest text-slate-400 uppercase">
                {item.label}
              </p>
              <div className={`mt-4 font-mono text-3xl font-black tracking-tighter ${item.textColor}`}>
                {item.count.toLocaleString()}
              </div>
              <div className="mt-2 h-1 w-8 rounded-full bg-slate-100 dark:bg-slate-700 transition-all group-hover:w-full group-hover:bg-blue-500/30" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

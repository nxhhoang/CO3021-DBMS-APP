import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, ShoppingBag, DollarSign } from 'lucide-react'
import AnimatedNumber from '@/components/common/AnimatedNumber'

interface SummaryCardProps {
  totalRevenue: number
  totalOrders: number
  startDateLabel: string
  endDateLabel: string
}

export default function SummaryCard({
  totalRevenue,
  totalOrders,
  startDateLabel,
  endDateLabel,
}: SummaryCardProps) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Revenue Card */}
      <Card className="card-premium border-none !bg-slate-900 text-white shadow-2xl">
        <CardContent className="px-6 py-4 lg:py-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                  <DollarSign size={14} strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  Doanh thu
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-mono text-3xl font-black tracking-tighter text-white">
                  <AnimatedNumber value={totalRevenue} />
                  <span className="ml-2 text-xs font-bold text-emerald-400 uppercase opacity-60">
                    đ
                  </span>
                </h3>
                <p className="text-[10px] font-bold tracking-tight text-slate-500">
                  {startDateLabel} — {endDateLabel}
                </p>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-emerald-500 backdrop-blur-sm">
              <TrendingUp size={24} strokeWidth={2.5} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Card */}
      <Card className="card-premium border-none bg-white shadow-xl shadow-slate-200/40">
        <CardContent className="px-6 py-4 lg:py-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <ShoppingBag size={14} strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  Đơn hàng
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-mono text-3xl font-black tracking-tighter text-slate-900">
                  <AnimatedNumber value={totalOrders} />
                  <span className="ml-2 text-xs font-bold text-slate-400 uppercase">
                    đơn
                  </span>
                </h3>
                <p className="text-[10px] font-bold tracking-tight text-slate-400">
                  {startDateLabel} — {endDateLabel}
                </p>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <ShoppingBag size={24} strokeWidth={2.5} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, ShoppingBag, DollarSign } from 'lucide-react'

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
  const [animatedRevenue, setAnimatedRevenue] = useState(0)
  const [animatedOrders, setAnimatedOrders] = useState(0)

  useEffect(() => {
    const duration = 1500
    const start = performance.now()
    const toRevenue = Math.max(0, totalRevenue)
    const toOrders = Math.max(0, totalOrders)

    let frameId = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setAnimatedRevenue(Math.round(toRevenue * easeOut))
      setAnimatedOrders(Math.round(toOrders * easeOut))

      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      }
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [totalRevenue, totalOrders])

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Revenue Card */}
      <Card className="card-premium border-none !bg-slate-900 text-white shadow-2xl">
        <CardContent className="p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-emerald-400">
                  <DollarSign size={18} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  Tổng doanh thu
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-mono text-3xl font-black tracking-tighter text-white sm:text-4xl">
                  {animatedRevenue.toLocaleString()}
                  <span className="ml-2 text-sm font-bold text-emerald-400/60 uppercase">
                    đ
                  </span>
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  Từ {startDateLabel} đến {endDateLabel}
                </p>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <TrendingUp size={24} strokeWidth={2.5} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Card */}
      <Card className="card-premium border-none bg-white shadow-xl shadow-slate-200/50">
        <CardContent className="p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <ShoppingBag size={18} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  Tổng đơn hàng
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-mono text-4xl font-black tracking-tighter text-slate-900">
                  {animatedOrders.toLocaleString()}
                  <span className="ml-2 text-sm font-bold text-slate-400 uppercase">
                    đơn
                  </span>
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  Từ {startDateLabel} đến {endDateLabel}
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

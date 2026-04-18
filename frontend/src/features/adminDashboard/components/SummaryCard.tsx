'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
    const duration = 2000
    const start = performance.now()

    const fromRevenue = 0
    const fromOrders = 0
    const toRevenue = Math.max(0, totalRevenue)
    const toOrders = Math.max(0, totalOrders)

    setAnimatedRevenue(0)
    setAnimatedOrders(0)

    let frameId = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -3 * progress)

      setAnimatedRevenue(
        Math.round(fromRevenue + (toRevenue - fromRevenue) * easeOut),
      )
      setAnimatedOrders(
        Math.round(fromOrders + (toOrders - fromOrders) * easeOut),
      )

      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      }
    }

    frameId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frameId)
  }, [totalRevenue, totalOrders])

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="border-l-6 border-l-emerald-500 shadow-sm">
        <CardHeader className="space-y-1 pb-1">
          <CardTitle className="text-muted-foreground text-lg font-semibold">
            Tổng doanh thu
          </CardTitle>
          <p className="text-muted-foreground text-xs">
            Từ {startDateLabel} đến {endDateLabel}
          </p>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-3xl font-bold text-emerald-600">
            {animatedRevenue.toLocaleString()}{' '}
            <span className="text-sm font-normal">VND</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-6 border-l-blue-500 shadow-sm">
        <CardHeader className="space-y-1 pb-1">
          <CardTitle className="text-muted-foreground text-lg font-semibold">
            Tổng đơn hàng
          </CardTitle>
          <p className="text-muted-foreground text-xs">
            Từ {startDateLabel} đến {endDateLabel}
          </p>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-3xl font-bold text-blue-600">
            {animatedOrders.toLocaleString()}{' '}
            <span className="text-sm font-normal">đơn</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

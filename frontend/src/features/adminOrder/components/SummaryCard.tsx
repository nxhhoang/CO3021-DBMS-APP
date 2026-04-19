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
    <div className="mb-6 grid grid-cols-1 gap-3 xl:grid-cols-[280px_minmax(0,1fr)]">
      <Card className="h-full w-full border-l-8 border-l-blue-600 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
            Tổng đơn hàng
          </CardTitle>
          <p className="text-muted-foreground text-[11px]">
            Theo dữ liệu admin hiện tại
          </p>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="text-5xl leading-none font-extrabold text-blue-700">
            {totalOrders.toLocaleString()}{' '}
            <span className="text-lg font-medium">đơn</span>
          </div>
        </CardContent>
      </Card>

      <Card className="h-full w-full shadow-sm">
        <CardHeader>
          <CardTitle className="text-muted-foreground text-base font-semibold">
            Theo trạng thái đơn hàng
          </CardTitle>
          <p className="text-muted-foreground text-[11px]">
            Tổng quan số lượng theo từng trạng thái
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {statusCounts.map((item) => (
              <div
                key={item.status}
                className={`bg-muted/20 rounded-md border-l-6 px-4 py-3 ${item.accentClass}`}
              >
                <p className="text-muted-foreground text-sm font-semibold">
                  {item.label}
                </p>
                <p className="text-muted-foreground mt-1 text-[11px]">
                  Đơn hàng có trạng thái này
                </p>
                <div className={`mt-2 text-2xl font-bold ${item.textColor}`}>
                  {item.count.toLocaleString()}{' '}
                  <span className="text-sm font-normal">đơn</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

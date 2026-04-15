'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, ChevronDownIcon } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'
import { statsService } from '@/services/stats.service'

interface RevenueItem {
  date: string
  totalRevenue: number
  orderCount: number
}

// MOCK DATA
const MOCK_REVENUE_DATA: RevenueItem[] = [
  { date: '2026-01-01', totalRevenue: 52000000, orderCount: 21 },
  { date: '2026-01-02', totalRevenue: 48000000, orderCount: 19 },
  { date: '2026-01-03', totalRevenue: 61000000, orderCount: 26 },
  { date: '2026-01-04', totalRevenue: 45000000, orderCount: 18 },
  { date: '2026-01-05', totalRevenue: 70000000, orderCount: 30 },
  { date: '2026-01-06', totalRevenue: 65000000, orderCount: 28 },
  { date: '2026-01-07', totalRevenue: 72000000, orderCount: 32 },
  { date: '2026-01-08', totalRevenue: 68000000, orderCount: 29 },
  { date: '2026-01-09', totalRevenue: 75000000, orderCount: 33 },
  { date: '2026-01-10', totalRevenue: 90000000, orderCount: 40 },
  { date: '2026-01-11', totalRevenue: 85000000, orderCount: 36 },
  { date: '2026-01-12', totalRevenue: 92000000, orderCount: 42 },
  { date: '2026-01-13', totalRevenue: 87000000, orderCount: 38 },
  { date: '2026-01-14', totalRevenue: 95000000, orderCount: 45 },
  { date: '2026-01-15', totalRevenue: 100000000, orderCount: 50 },
  { date: '2026-01-16', totalRevenue: 98000000, orderCount: 47 },
  { date: '2026-01-17', totalRevenue: 105000000, orderCount: 52 },
  { date: '2026-01-18', totalRevenue: 110000000, orderCount: 55 },
  { date: '2026-01-19', totalRevenue: 102000000, orderCount: 48 },
  { date: '2026-01-20', totalRevenue: 115000000, orderCount: 60 },
  { date: '2026-01-21', totalRevenue: 120000000, orderCount: 65 },
  { date: '2026-01-22', totalRevenue: 108000000, orderCount: 54 },
  { date: '2026-01-23', totalRevenue: 125000000, orderCount: 68 },
  { date: '2026-01-24', totalRevenue: 130000000, orderCount: 70 },
  { date: '2026-01-25', totalRevenue: 118000000, orderCount: 60 },
  { date: '2026-01-26', totalRevenue: 135000000, orderCount: 75 },
  { date: '2026-01-27', totalRevenue: 140000000, orderCount: 80 },
  { date: '2026-01-28', totalRevenue: 132000000, orderCount: 72 },
  { date: '2026-01-29', totalRevenue: 145000000, orderCount: 85 },
  { date: '2026-01-30', totalRevenue: 150000000, orderCount: 90 },
]

export default function DashboardPage() {
  const [data, setData] = useState<RevenueItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [startDate, setStartDate] = useState<Date>(parseISO('2026-01-01'))
  const [endDate, setEndDate] = useState<Date>(parseISO('2026-02-01'))
  const [type, setType] = useState<'day' | 'month'>('day')

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      await new Promise((resolve) => setTimeout(resolve, 500))
      setData(MOCK_REVENUE_DATA)
    } catch (err: any) {
      setError(err?.message || 'Lỗi khi tải dữ liệu')
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const totalRevenue = data.reduce(
    (sum, item) => sum + (item.totalRevenue || 0),
    0,
  )
  const totalOrders = data.reduce(
    (sum, item) => sum + (item.orderCount || 0),
    0,
  )

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={fetchData} variant="outline" disabled={loading}>
          {loading ? 'Đang tải...' : 'Làm mới dữ liệu'}
        </Button>
      </div>

      {/* FILTER SECTION */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Bộ lọc báo cáo</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
          {/* TỪ NGÀY (Date Picker) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-muted-foreground text-xs font-medium">
              Từ ngày
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-[180px] justify-start text-left font-normal',
                    !startDate && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, 'dd/MM/yyyy')
                  ) : (
                    <span>Chọn ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* ĐẾN NGÀY (Date Picker) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-muted-foreground text-xs font-medium">
              Đến ngày
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-[180px] justify-start text-left font-normal',
                    !endDate && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? (
                    format(endDate, 'dd/MM/yyyy')
                  ) : (
                    <span>Chọn ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && setEndDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-muted-foreground text-xs font-medium">
              Chế độ
            </label>
            <Select
              value={type}
              onValueChange={(v: 'day' | 'month') => setType(v)}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Theo ngày</SelectItem>
                <SelectItem value="month">Theo tháng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={fetchData}
            className="bg-primary text-primary-foreground px-8"
          >
            Lọc báo cáo
          </Button>
        </CardContent>
      </Card>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Tổng doanh thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {totalRevenue.toLocaleString()}{' '}
              <span className="text-sm font-normal">VND</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Tổng đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalOrders.toLocaleString()}{' '}
              <span className="text-sm font-normal">đơn</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CHART SECTION */}
      <Card>
        <CardHeader>
          <CardTitle>Phân tích biến động doanh thu & Đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-4 h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis
                  yAxisId="left"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  // Đã sửa lỗi TS: name có thể undefined, value có thể là string/number
                  formatter={(value: any, name: any) => {
                    const label =
                      name === 'totalRevenue' ? 'Doanh thu' : 'Số đơn hàng'
                    const formattedValue =
                      name === 'totalRevenue'
                        ? `${Number(value).toLocaleString()} VND`
                        : value
                    return [formattedValue, label]
                  }}
                />
                <Legend verticalAlign="top" align="right" height={36} />

                <Bar
                  yAxisId="right"
                  dataKey="orderCount"
                  name="orderCount" // Tên key trong data để tooltip nhận diện
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />

                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="totalRevenue"
                  name="totalRevenue" // Tên key trong data để tooltip nhận diện
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* TABLE SECTION */}
      <Card>
        <CardHeader>
          <CardTitle>Bảng chi tiết</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b transition-colors">
                  <th className="text-muted-foreground h-12 px-4 text-left font-medium">
                    Thời gian
                  </th>
                  <th className="text-muted-foreground h-12 px-4 text-right font-medium">
                    Doanh thu (VND)
                  </th>
                  <th className="text-muted-foreground h-12 px-4 text-right font-medium">
                    Số đơn
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-muted/50 border-b transition-colors"
                  >
                    <td className="p-4 font-medium">{item.date}</td>
                    <td className="p-4 text-right">
                      {item.totalRevenue.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">{item.orderCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

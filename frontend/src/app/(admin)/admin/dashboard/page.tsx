'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { endOfDay, format, parseISO, startOfDay } from 'date-fns'

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
import FilterSection from '@/features/adminDashboard/components/FilterSection'
import SummaryCard from '@/features/adminDashboard/components/SummaryCard'
import { RevenueStat } from '@/types'

// MOCK DATA
const MOCK_REVENUE_DATA: RevenueStat[] = [
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

const filterRevenueData = (
  items: RevenueStat[],
  startDate: Date,
  endDate: Date,
  type: 'day' | 'month',
) => {
  const start = startOfDay(startDate)
  const end = endOfDay(endDate)

  const filteredItems = items.filter((item) => {
    const itemDate = parseISO(item.date)
    return itemDate >= start && itemDate <= end
  })

  if (type === 'day') {
    return filteredItems
  }

  const groupedByMonth = new Map<string, RevenueStat>()

  filteredItems.forEach((item) => {
    const itemDate = parseISO(item.date)
    const monthKey = format(itemDate, 'yyyy-MM')
    const existingItem = groupedByMonth.get(monthKey)

    if (existingItem) {
      groupedByMonth.set(monthKey, {
        date: existingItem.date,
        totalRevenue: existingItem.totalRevenue + item.totalRevenue,
        orderCount: existingItem.orderCount + item.orderCount,
      })
      return
    }

    groupedByMonth.set(monthKey, {
      date: `${monthKey}-01`,
      totalRevenue: item.totalRevenue,
      orderCount: item.orderCount,
    })
  })

  return Array.from(groupedByMonth.values())
}

const formatRevenueDate = (date: string, type: 'day' | 'month') =>
  type === 'month'
    ? format(parseISO(date), 'MM/yyyy')
    : format(parseISO(date), 'dd/MM/yyyy')

export default function DashboardPage() {
  const [data, setData] = useState<RevenueStat[]>([])
  const [summaryTotals, setSummaryTotals] = useState({
    totalRevenue: 0,
    totalOrders: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentDate = new Date()
  const [startDate, setStartDate] = useState<Date>(parseISO('2026-01-01'))
  const [endDate, setEndDate] = useState<Date>(currentDate)
  const [type, setType] = useState<'day' | 'month'>('day')

  const [appliedStartDate, setAppliedStartDate] = useState<Date>(startDate)
  const [appliedEndDate, setAppliedEndDate] = useState<Date>(endDate)
  const [appliedType, setAppliedType] = useState<'day' | 'month'>(type)

  const hasFilterChanges = useMemo(() => {
    const draftStart = format(startDate, 'yyyy-MM-dd')
    const draftEnd = format(endDate, 'yyyy-MM-dd')
    const appliedStart = format(appliedStartDate, 'yyyy-MM-dd')
    const appliedEnd = format(appliedEndDate, 'yyyy-MM-dd')

    return (
      draftStart !== appliedStart ||
      draftEnd !== appliedEnd ||
      type !== appliedType
    )
  }, [startDate, endDate, type, appliedStartDate, appliedEndDate, appliedType])

  const fetchData = () => {
    if (startDate > endDate) {
      setError('Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc')
      return
    }

    if (endDate > currentDate) {
      setError('Ngày kết thúc không được lớn hơn ngày hiện tại')
      return
    }

    setLoading(true)
    setError(null)

    const filteredData = filterRevenueData(
      MOCK_REVENUE_DATA,
      startDate,
      endDate,
      type,
    )
    const totals = filteredData.reduce(
      (acc, item) => {
        acc.totalRevenue += item.totalRevenue || 0
        acc.totalOrders += item.orderCount || 0
        return acc
      },
      { totalRevenue: 0, totalOrders: 0 },
    )

    setAppliedStartDate(startDate)
    setAppliedEndDate(endDate)
    setAppliedType(type)
    setData(filteredData)
    setSummaryTotals(totals)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    // Initial data should load once; later updates happen only from the action button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={fetchData} variant="outline" disabled={loading}>
          {loading ? 'Đang tải...' : 'Làm mới dữ liệu'}
        </Button>
      </div>

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}

      {/* FILTER SECTION */}
      <FilterSection
        startDate={startDate}
        endDate={endDate}
        currentDate={currentDate}
        type={type}
        loading={loading}
        hasFilterChanges={hasFilterChanges}
        onStartDateChange={(date) => {
          setStartDate(date)
          if (date > endDate) setEndDate(date)
        }}
        onEndDateChange={setEndDate}
        onTypeChange={setType}
        onApply={fetchData}
      />

      {/* SUMMARY CARDS */}
      <SummaryCard
        totalRevenue={summaryTotals.totalRevenue}
        totalOrders={summaryTotals.totalOrders}
        startDateLabel={format(appliedStartDate, 'dd/MM/yyyy')}
        endDateLabel={format(appliedEndDate, 'dd/MM/yyyy')}
      />

      {/* CHART SECTION */}
      <Card>
        <CardHeader>
          <CardTitle>Phân tích biến động doanh thu & Đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-4 h-100 w-full">
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
                  tickFormatter={(val) => formatRevenueDate(val, appliedType)}
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
                  name="orderCount"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />

                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="totalRevenue"
                  name="totalRevenue"
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
                {data.length > 0 ? (
                  data.map((item) => (
                    <tr
                      key={item.date}
                      className="hover:bg-muted/50 border-b transition-colors"
                    >
                      <td className="p-4 font-medium">
                        {formatRevenueDate(item.date, appliedType)}
                      </td>
                      <td className="p-4 text-right">
                        {item.totalRevenue.toLocaleString()}
                      </td>
                      <td className="p-4 text-right">{item.orderCount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-muted-foreground p-4" colSpan={3}>
                      Không có dữ liệu trong khoảng thời gian đã chọn.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

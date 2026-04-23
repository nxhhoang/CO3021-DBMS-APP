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

import { statsService } from '@/services/stats.service'

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
  // Mặc định xem từ đầu tháng hiện tại
  const [startDate, setStartDate] = useState<Date>(startOfDay(new Date(new Date().getFullYear(), new Date().getMonth(), 1)))
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

  const fetchData = async () => {
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

    try {
      const response = await statsService.getRevenue({
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        type: type,
      })

      if (response.data) {
        // Đảm bảo kiểu dữ liệu là number (backend có thể trả về string cho BIGINT/COUNT)
        const fetchedData = response.data.map((item) => ({
          ...item,
          totalRevenue: Number(item.totalRevenue),
          orderCount: Number(item.orderCount),
        }))

        const totals = fetchedData.reduce(
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
        setData(fetchedData)
        setSummaryTotals(totals)
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Đã có lỗi xảy ra khi kết nối server',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
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

'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format, parseISO, startOfDay } from 'date-fns'
import {
  BarChart3,
  RefreshCw,
  Table as TableIcon,
  LayoutDashboard,
} from 'lucide-react'

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
import { cn } from '@/lib/utils'
import {
  PremiumTable,
  PremiumTableCell,
  PremiumTableHead,
  PremiumTableHeader,
  PremiumTableRow,
} from '@/components/common/PremiumTable'

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
  const [startDate, setStartDate] = useState<Date>(
    startOfDay(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
  )
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

    setLoading(true)
    setError(null)

    try {
      const response = await statsService.getRevenue({
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        type: type,
      })

      if (response.data) {
        const fetchedData = response.data.map((item) => ({
          ...item,
          totalRevenue: Number(item.totalRevenue || 0),
          orderCount: Number(item.orderCount || 0),
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
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message
      setError(msg || 'Đã có lỗi xảy ra khi kết nối server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="animate-in fade-in slide-in-from-top-4 space-y-8 duration-1000">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-[11px] font-black tracking-widest text-blue-600 uppercase backdrop-blur-sm">
            Hệ thống quản lý
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Bảng <span className="text-gradient-primary">Điều khiển</span>
          </h1>
          <p className="font-sans text-lg font-medium text-slate-500">
            Tổng quan tình hình kinh doanh và phân tích doanh thu thời gian
            thực.
          </p>
        </div>

        <Button
          onClick={fetchData}
          variant="outline"
          disabled={loading}
          className="btn-premium-secondary h-12 px-6 shadow-sm"
        >
          <RefreshCw
            className={cn('mr-2 h-4 w-4', loading && 'animate-spin')}
          />
          Làm mới dữ liệu
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4">
          <div className="h-2 w-2 rounded-full bg-rose-500" />
          <p className="text-sm font-bold text-rose-600">{error}</p>
        </div>
      )}

      {/* FILTER & SUMMARY */}
      <div className="grid gap-8">
        <FilterSection
          startDate={startDate}
          endDate={endDate}
          currentDate={currentDate}
          type={type}
          loading={loading}
          hasFilterChanges={hasFilterChanges}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onTypeChange={setType}
          onApply={fetchData}
        />

        <SummaryCard
          totalRevenue={summaryTotals.totalRevenue}
          totalOrders={summaryTotals.totalOrders}
          startDateLabel={format(appliedStartDate, 'dd/MM/yyyy')}
          endDateLabel={format(appliedEndDate, 'dd/MM/yyyy')}
        />
      </div>

      {/* CHART SECTION */}
      <Card className="card-premium border-none bg-white shadow-xl shadow-slate-200/40">
        <CardHeader className="border-b border-slate-100 p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BarChart3 size={20} strokeWidth={2.5} />
            </div>
            <CardTitle className="font-display text-xl font-black tracking-tight text-slate-900">
              Biến động doanh thu & Đơn hàng
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="date"
                  fontSize={11}
                  fontWeight={700}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#94a3b8' }}
                  tickFormatter={(val) => formatRevenueDate(val, appliedType)}
                />
                <YAxis
                  yAxisId="left"
                  fontSize={11}
                  fontWeight={700}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#94a3b8' }}
                  tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  fontSize={11}
                  fontWeight={700}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#94a3b8' }}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '12px 16px',
                  }}
                  itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                  labelStyle={{
                    fontWeight: 800,
                    color: '#94a3b8',
                    marginBottom: '4px',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                  }}
                  formatter={(value: number | string, name: string) => {
                    const label =
                      name === 'totalRevenue' ? 'Doanh thu' : 'Số đơn'
                    const formattedValue =
                      name === 'totalRevenue'
                        ? `${Number(value).toLocaleString()}đ`
                        : `${value} đơn`
                    return [formattedValue, label]
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{
                    paddingBottom: '20px',
                    fontWeight: 800,
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                />

                <Bar
                  yAxisId="right"
                  dataKey="orderCount"
                  name="orderCount"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                />

                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="totalRevenue"
                  name="totalRevenue"
                  stroke="#10b981"
                  strokeWidth={4}
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 4, stroke: '#fff' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* TABLE SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <TableIcon size={18} strokeWidth={2.5} />
          </div>
          <h2 className="font-display text-xl font-black tracking-tight text-slate-900">
            Chi tiết dữ liệu
          </h2>
        </div>

        <PremiumTable>
          <PremiumTableHeader>
            <PremiumTableRow>
              <PremiumTableHead>Thời gian</PremiumTableHead>
              <PremiumTableHead className="text-right">
                Doanh thu (VND)
              </PremiumTableHead>
              <PremiumTableHead className="text-right">
                Số lượng đơn hàng
              </PremiumTableHead>
            </PremiumTableRow>
          </PremiumTableHeader>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <PremiumTableRow key={item.date}>
                  <PremiumTableCell className="font-bold text-slate-900">
                    {formatRevenueDate(item.date, appliedType)}
                  </PremiumTableCell>
                  <PremiumTableCell className="text-right font-mono text-base font-black tracking-tighter text-emerald-600">
                    {item.totalRevenue.toLocaleString()}
                    <span className="ml-1 text-[10px] font-bold text-slate-400">
                      đ
                    </span>
                  </PremiumTableCell>
                  <PremiumTableCell className="text-right">
                    <span className="glass-badge-blue">
                      {item.orderCount} đơn hàng
                    </span>
                  </PremiumTableCell>
                </PremiumTableRow>
              ))
            ) : (
              <PremiumTableRow>
                <PremiumTableCell colSpan={3} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center opacity-40">
                    <LayoutDashboard
                      size={40}
                      className="mb-4 text-slate-300"
                    />
                    <p className="font-bold text-slate-400">
                      Không có dữ liệu trong khoảng thời gian đã chọn
                    </p>
                  </div>
                </PremiumTableCell>
              </PremiumTableRow>
            )}
          </tbody>
        </PremiumTable>
      </div>
    </div>
  )
}

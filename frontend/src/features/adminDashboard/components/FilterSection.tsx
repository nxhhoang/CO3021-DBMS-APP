'use client'

import { format } from 'date-fns'
import { CalendarIcon, Filter, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface FilterSectionProps {
  startDate: Date
  endDate: Date
  currentDate: Date
  type: 'day' | 'month'
  loading: boolean
  hasFilterChanges: boolean
  onStartDateChange: (date: Date) => void
  onEndDateChange: (date: Date) => void
  onTypeChange: (value: 'day' | 'month') => void
  onApply: () => void
}

export default function FilterSection({
  startDate,
  endDate,
  currentDate,
  type,
  loading,
  hasFilterChanges,
  onStartDateChange,
  onEndDateChange,
  onTypeChange,
  onApply,
}: FilterSectionProps) {
  return (
    <Card className="card-premium border-none bg-white/70 shadow-xl shadow-slate-200/40 backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Filter size={18} strokeWidth={2.5} />
          </div>
          <CardTitle className="font-display text-lg font-black tracking-tight text-slate-900">
            Bộ lọc báo cáo
          </CardTitle>
        </div>
        <Button
          onClick={onApply}
          disabled={loading || !hasFilterChanges}
          className="btn-premium-primary h-10 px-6 shadow-lg shadow-slate-900/10"
        >
          {loading ? 'Đang cập nhật...' : 'Áp dụng bộ lọc'}
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Start Date */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Từ ngày
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'input-premium h-12 w-full justify-start text-left font-bold',
                    !startDate && 'text-slate-400',
                  )}
                >
                  <CalendarIcon className="mr-3 h-4 w-4 text-blue-600" />
                  {startDate ? (
                    format(startDate, 'dd/MM/yyyy')
                  ) : (
                    <span>Chọn ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto rounded-3xl p-0 shadow-2xl"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && onStartDateChange(date)}
                  disabled={(date) => date > currentDate || date > endDate}
                  initialFocus
                  className="p-3"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Đến ngày
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'input-premium h-12 w-full justify-start text-left font-bold',
                    !endDate && 'text-slate-400',
                  )}
                >
                  <CalendarIcon className="mr-3 h-4 w-4 text-blue-600" />
                  {endDate ? (
                    format(endDate, 'dd/MM/yyyy')
                  ) : (
                    <span>Chọn ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto rounded-3xl p-0 shadow-2xl"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && onEndDateChange(date)}
                  disabled={(date) => date < startDate || date > currentDate}
                  initialFocus
                  className="p-3"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Mode Select */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Chế độ hiển thị
            </label>
            <Select value={type} onValueChange={onTypeChange}>
              <SelectTrigger className="select-premium-trigger h-12 border-slate-200">
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent className="select-premium-content">
                <SelectItem value="day" className="select-premium-item">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-blue-600" />
                    Theo ngày
                  </div>
                </SelectItem>
                <SelectItem value="month" className="select-premium-item">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-blue-600" />
                    Theo tháng
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

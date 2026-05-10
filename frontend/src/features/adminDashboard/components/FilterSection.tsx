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
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:items-center lg:gap-6">
        {/* Start Date */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 px-1">
            <CalendarIcon size={12} className="text-blue-600" />
            <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Từ ngày
            </label>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'input-premium h-9 w-full justify-start px-3 text-left text-xs font-bold lg:w-[140px]',
                  !startDate && 'text-slate-400',
                )}
              >
                {startDate ? format(startDate, 'dd/MM/yyyy') : 'Ngày'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="glass-popover w-auto rounded-xl p-0 shadow-2xl" align="end">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && onStartDateChange(date)}
                disabled={(date) => date > currentDate || date > endDate}
                initialFocus
                className="p-2"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 px-1">
            <CalendarIcon size={12} className="text-blue-600" />
            <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Đến ngày
            </label>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'input-premium h-9 w-full justify-start px-3 text-left text-xs font-bold lg:w-[140px]',
                  !endDate && 'text-slate-400',
                )}
              >
                {endDate ? format(endDate, 'dd/MM/yyyy') : 'Ngày'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="glass-popover w-auto rounded-xl p-0 shadow-2xl" align="end">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && onEndDateChange(date)}
                disabled={(date) => date < startDate || date > currentDate}
                initialFocus
                className="p-2"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Mode Select */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 px-1">
            <CheckCircle2 size={12} className="text-blue-600" />
            <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Chế độ
            </label>
          </div>
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger className="select-premium-trigger lg:w-[120px]">
              <SelectValue placeholder="Loại" />
            </SelectTrigger>
            <SelectContent className="select-premium-content">
              <SelectItem value="day" className="select-premium-item py-1.5 text-xs">Ngày</SelectItem>
              <SelectItem value="month" className="select-premium-item py-1.5 text-xs">Tháng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={onApply}
        disabled={loading || !hasFilterChanges}
        className="btn-premium-primary h-9 min-w-[100px] px-6 text-[10px] font-black uppercase tracking-wider shadow-lg shadow-slate-900/10 lg:mt-5"
      >
        {loading ? '...' : 'Lọc'}
      </Button>
    </div>
  )
}

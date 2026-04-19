'use client'

import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
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
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold">Bộ lọc báo cáo</CardTitle>
        <Button
          onClick={onApply}
          className="bg-primary text-primary-foreground px-6"
          disabled={loading || !hasFilterChanges}
        >
          Lọc báo cáo
        </Button>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-muted-foreground text-xs font-medium">
              Từ ngày
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
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
                  onSelect={(date) => date && onStartDateChange(date)}
                  disabled={(date) => date > currentDate || date > endDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-muted-foreground text-xs font-medium">
              Đến ngày
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
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
                  onSelect={(date) => date && onEndDateChange(date)}
                  disabled={(date) => date < startDate || date > currentDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-muted-foreground text-xs font-medium">
              Chế độ
            </label>
            <Select value={type} onValueChange={onTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Theo ngày</SelectItem>
                <SelectItem value="month">Theo tháng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

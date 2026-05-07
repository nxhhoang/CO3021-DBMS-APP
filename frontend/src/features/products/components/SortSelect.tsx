'use client'

import { SORT_BY } from '@/constants/enum'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SortSelectProps {
  value: string
  onChange: (value: string) => void
}

const SortSelect = ({ value, onChange }: SortSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="select-premium-trigger">
        <SelectValue placeholder="Sắp xếp theo..." />
      </SelectTrigger>

      <SelectContent className="select-premium-content">
        <SelectItem value={SORT_BY.SOLD_DESC} className="select-premium-item">
          Phổ biến nhất
        </SelectItem>
        <SelectItem value={SORT_BY.PRICE_ASC} className="select-premium-item">
          Giá: Thấp đến Cao
        </SelectItem>
        <SelectItem value={SORT_BY.PRICE_DESC} className="select-premium-item">
          Giá: Cao đến Thấp
        </SelectItem>
        <SelectItem value={SORT_BY.RATING_DESC} className="select-premium-item">
          Đánh giá tốt nhất
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

export default SortSelect

'use client';

import { SORT_BY } from '@/constants/enum'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const SortSelect = ({ value, onChange }: SortSelectProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-muted-foreground text-sm font-semibold uppercase">
        Sắp xếp
      </h3>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-background w-full">
          <SelectValue placeholder="Chọn cách sắp xếp" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value={SORT_BY.POPULARITY}>Bán chạy nhất</SelectItem>
          <SelectItem value={SORT_BY.PRICE_ASC}>Giá tăng dần</SelectItem>
          <SelectItem value={SORT_BY.PRICE_DESC}>Giá giảm dần</SelectItem>
          <SelectItem value={SORT_BY.RATING}>Đánh giá cao</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
};

export default SortSelect;

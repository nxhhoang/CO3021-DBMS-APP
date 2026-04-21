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
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-14 w-full rounded-full border-slate-100 bg-white font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:ring-2 focus:ring-blue-500/10 dark:border-white/5 dark:bg-slate-900 dark:text-slate-300">
        <SelectValue placeholder="Sắp xếp theo..." />
      </SelectTrigger>

      <SelectContent className="rounded-[2rem] border-slate-100 p-3 shadow-2xl dark:border-white/10 dark:bg-slate-900">
        <SelectItem value={SORT_BY.POPULARITY} className="rounded-2xl font-bold transition-colors focus:bg-blue-50 focus:text-blue-600 dark:focus:bg-blue-900/30">
          Phổ biến nhất
        </SelectItem>
        <SelectItem value={SORT_BY.PRICE_ASC} className="rounded-2xl font-bold transition-colors focus:bg-blue-50 focus:text-blue-600 dark:focus:bg-blue-900/30">
          Giá: Thấp đến Cao
        </SelectItem>
        <SelectItem value={SORT_BY.PRICE_DESC} className="rounded-2xl font-bold transition-colors focus:bg-blue-50 focus:text-blue-600 dark:focus:bg-blue-900/30">
          Giá: Cao đến Thấp
        </SelectItem>
        <SelectItem value={SORT_BY.RATING} className="rounded-2xl font-bold transition-colors focus:bg-blue-50 focus:text-blue-600 dark:focus:bg-blue-900/30">
          Đánh giá tốt nhất
        </SelectItem>
      </SelectContent>
    </Select>
  )
};

export default SortSelect;

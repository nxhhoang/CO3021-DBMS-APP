import { ListFilter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Category } from '@/types/category.types';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  categories: Category[];
}

const CategorySelect = ({
  value,
  onChange,
  categories,
}: CategorySelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-14 w-full rounded-full border-slate-100 bg-white font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:ring-2 focus:ring-blue-500/10 dark:border-white/5 dark:bg-slate-900 dark:text-slate-300">
        <div className="flex items-center gap-3">
          <ListFilter className="h-4 w-4 text-blue-600" strokeWidth={2.5} />
          <SelectValue placeholder="Tất cả danh mục" />
        </div>
      </SelectTrigger>

      <SelectContent className="rounded-[2rem] border-slate-100 p-3 shadow-2xl dark:border-white/10 dark:bg-slate-900">
        <SelectItem value="all" className="rounded-2xl font-bold transition-colors focus:bg-blue-50 focus:text-blue-600 dark:focus:bg-blue-900/30">
          Tất cả danh mục
        </SelectItem>

        {categories?.map((cat) => (
          <SelectItem 
            key={cat.slug} 
            value={cat.slug}
            className="rounded-2xl font-bold transition-colors focus:bg-blue-50 focus:text-blue-600 dark:focus:bg-blue-900/30"
          >
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategorySelect;

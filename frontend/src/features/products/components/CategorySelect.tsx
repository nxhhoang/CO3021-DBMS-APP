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
      <SelectTrigger className="bg-background w-full">
        <SelectValue placeholder="Tất cả" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">Tất cả danh mục</SelectItem>

        {categories?.map((cat) => (
          <SelectItem key={cat.slug} value={cat.slug}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategorySelect;

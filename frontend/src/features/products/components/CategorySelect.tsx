import { ListFilter } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { Category } from '@/types/category.types'

interface CategorySelectProps {
  value: string
  onChange: (value: string) => void
  categories: Category[]
}

const CategorySelect = ({
  value,
  onChange,
  categories,
}: CategorySelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="select-premium-trigger">
        <div className="flex items-center gap-3">
          <ListFilter className="h-4 w-4 text-blue-600" strokeWidth={2.5} />
          <SelectValue placeholder="Tất cả danh mục" />
        </div>
      </SelectTrigger>

      <SelectContent className="select-premium-content">
        <SelectItem value="all" className="select-premium-item">
          Tất cả danh mục
        </SelectItem>

        {categories?.map((cat) => (
          <SelectItem
            key={cat.slug}
            value={cat.slug}
            className="select-premium-item"
          >
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default CategorySelect

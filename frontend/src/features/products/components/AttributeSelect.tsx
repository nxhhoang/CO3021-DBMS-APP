'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from '@/types/category.types';

interface AttributeSelectProps {
  category?: Category;
  localAttrs: Record<string, string>;
  setLocalAttrs: (attrs: Record<string, string>) => void;
}

const AttributeSelect = ({
  category,
  localAttrs,
  setLocalAttrs,
}: AttributeSelectProps) => {
  if (
    !category ||
    !Array.isArray(category.dynamicAttributes) ||
    category.dynamicAttributes.length === 0
  ) {
    return null
  }

  return (
    <div className="space-y-6">
      {category.dynamicAttributes.map((attr) => {
        const options = Array.isArray(attr.options) ? attr.options : []

        return (
          <div key={attr.key} className="space-y-4">
            <h3 className="font-display text-[11px] font-black tracking-widest text-slate-400 uppercase">
              {attr.label}
            </h3>

            <Select
              value={localAttrs[attr.key] || 'all'}
              onValueChange={(val) => {
                const newAttrs = { ...localAttrs }

                if (val === 'all') {
                  delete newAttrs[attr.key]
                } else {
                  newAttrs[attr.key] = val
                }

                setLocalAttrs(newAttrs)
              }}
            >
              <SelectTrigger className="h-12 w-full rounded-full border-slate-100 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:ring-2 focus:ring-blue-500/10 dark:border-white/5 dark:bg-slate-900 dark:text-slate-300">
                <SelectValue placeholder={`Chọn ${attr.label.toLowerCase()}`} />
              </SelectTrigger>

              <SelectContent className="rounded-2xl border-slate-100 p-2 shadow-2xl dark:border-white/10 dark:bg-slate-900">
                <SelectItem value="all" className="rounded-xl text-xs font-bold transition-colors focus:bg-blue-50 focus:text-blue-600 dark:focus:bg-blue-900/30">
                  Tất cả {attr.label.toLowerCase()}
                </SelectItem>

                {options.map((opt) => (
                  <SelectItem
                    key={`${attr.key}-${String(opt)}`}
                    value={String(opt)}
                    className="rounded-xl text-xs font-bold transition-colors focus:bg-blue-50 focus:text-blue-600 dark:focus:bg-blue-900/30"
                  >
                    {String(opt)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      })}
    </div>
  )
};

export default AttributeSelect;

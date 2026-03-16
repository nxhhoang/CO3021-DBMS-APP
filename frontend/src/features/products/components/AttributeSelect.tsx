'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings2 } from 'lucide-react';
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
  if (!category || category.dynamicAttributes.length === 0) return null;

  return (
    <>
      <Separator />

      <div className="space-y-4">
        <div className="text-muted-foreground flex items-center gap-2">
          <Settings2 className="h-4 w-4" />
          <h3 className="text-primary text-sm font-semibold uppercase">
            Thông số
          </h3>
        </div>
        {category.dynamicAttributes.map((attr) => (
          <div key={attr.key} className="space-y-2">
            <label className="text-xs font-medium text-gray-500">
              {attr.label}
            </label>

            <Select
              value={localAttrs[attr.key] || 'all'}
              onValueChange={(val) => {
                const newAttrs = { ...localAttrs };

                if (val === 'all') {
                  delete newAttrs[attr.key];
                } else {
                  newAttrs[attr.key] = val;
                }

                setLocalAttrs(newAttrs);
              }}
            >
              <SelectTrigger className="bg-background h-8 w-full text-xs">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  Tất cả {attr.label.toLowerCase()}
                </SelectItem>

                {attr.options.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </>
  );
};

export default AttributeSelect;

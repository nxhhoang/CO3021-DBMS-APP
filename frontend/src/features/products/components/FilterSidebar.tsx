'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Category } from '@/types/category.types';
import { Filter, ListFilter, Settings2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterBarProps {
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  sort: string;
  setSort: (value: string) => void;
  categories: Category[];
}

const FilterSidebar = ({
  priceRange,
  setPriceRange,
  sort,
  setSort,
  categories,
}: FilterBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [localCategory, setLocalCategory] = useState<string>(
    searchParams.get('category') || 'all',
  );

  const [localAttrs, setLocalAttrs] = useState<Record<string, string>>({});

  const selectedCategoryData = categories.find((c) => c.slug === localCategory);

  // Load attrs từ URL khi mount
  useEffect(() => {
    const attrs: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      const match = key.match(/^attrs\[(.*)\]$/);
      if (match) attrs[match[1]] = value;
    });

    setLocalAttrs(attrs);
  }, [searchParams]);

  // Reset attrs khi đổi category
  useEffect(() => {
    setLocalAttrs({});
  }, [localCategory]);

  const handleApply = () => {
    const newParams = new URLSearchParams(searchParams.toString());

    const oldCategory = searchParams.get('category');

    // Nếu category thay đổi → xoá attrs
    if (oldCategory !== localCategory) {
      Array.from(newParams.keys()).forEach((key) => {
        if (key.startsWith('attrs[')) {
          newParams.delete(key);
        }
      });
    }

    // Category
    if (localCategory && localCategory !== 'all') {
      newParams.set('category', localCategory);
    } else {
      newParams.delete('category');
    }

    // Price
    newParams.set('price_min', priceRange[0].toString());
    newParams.set('price_max', priceRange[1].toString());

    // Sort
    if (sort) newParams.set('sort', sort);
    else newParams.delete('sort');

    // Dynamic attrs
    Object.entries(localAttrs).forEach(([key, value]) => {
      if (value && value !== 'all') {
        newParams.set(`attrs[${key}]`, value);
      }
    });

    newParams.set('page', '1');

    router.push(`/products?${newParams.toString()}`);
  };

  return (
    <aside className="bg-card sticky top-20 h-fit w-full space-y-5 rounded-lg border p-5 shadow-sm md:w-64">
      <div className="text-primary flex items-center gap-2 pb-2">
        <Filter className="h-5 w-5" />
        <h2 className="text-lg font-bold">Bộ lọc</h2>
      </div>

      <Separator />

      {/* Category */}
      <div className="space-y-3">
        <div className="text-muted-foreground flex items-center gap-2">
          <ListFilter className="h-4 w-4" />
          <h3 className="text-sm font-semibold uppercase">Danh mục</h3>
        </div>

        <Select value={localCategory} onValueChange={setLocalCategory}>
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
      </div>

      {/* Dynamic Attributes */}
      {selectedCategoryData &&
        selectedCategoryData.dynamicAttributes.length > 0 && (
          <>
            <Separator />

            <div className="space-y-4">
              <div className="text-muted-foreground flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                <h3 className="text-primary text-sm font-semibold uppercase">
                  Thông số
                </h3>
              </div>

              {selectedCategoryData.dynamicAttributes.map((attr) => (
                <div key={attr.key} className="space-y-2">
                  <label className="text-xs font-medium text-gray-500">
                    {attr.label}
                  </label>

                  <Select
                    value={localAttrs[attr.key] || 'all'}
                    onValueChange={(val) =>
                      setLocalAttrs({
                        ...localAttrs,
                        [attr.key]: val,
                      })
                    }
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
        )}

      <Separator />

      {/* Price */}
      <div className="space-y-4">
        <h3 className="text-muted-foreground text-sm font-semibold uppercase">
          Giá (₫)
        </h3>

        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceRange[0]}
            className="bg-muted/50 w-full rounded-md border px-2 py-1 text-sm"
            onChange={(e) =>
              setPriceRange([Number(e.target.value), priceRange[1]])
            }
          />

          <span>-</span>

          <input
            type="number"
            value={priceRange[1]}
            className="bg-muted/50 w-full rounded-md border px-2 py-1 text-sm"
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
          />
        </div>

        <Slider
          min={0}
          max={5000}
          step={50}
          value={priceRange}
          onValueChange={(val) => setPriceRange(val as [number, number])}
        />
      </div>

      <Separator />

      {/* Sort */}
      <div className="space-y-3">
        <h3 className="text-muted-foreground text-sm font-semibold uppercase">
          Sắp xếp
        </h3>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="bg-background w-full">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="price_asc">Giá tăng dần</SelectItem>
            <SelectItem value="price_desc">Giá giảm dần</SelectItem>
            <SelectItem value="sold_desc">Bán chạy nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        className="w-full font-bold shadow-blue-200"
        onClick={handleApply}
      >
        ÁP DỤNG
      </Button>
    </aside>
  );
};

export default FilterSidebar;

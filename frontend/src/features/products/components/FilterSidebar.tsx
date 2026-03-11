'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Category } from '@/types/category.types';
import { Filter, ListFilter, Settings2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import CategorySelect from './CategorySelect';
import PriceRangeSlider from './PriceRangeSlider';
import SortSelect from './SortSelect';
import AttributeFilters from './AttributeSelect';

import { useProductFilterNavigation } from '../hooks/useProductFilterNavigation';

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
  const searchParams = useSearchParams();
  const { applyFilters } = useProductFilterNavigation();

  const [localCategory, setLocalCategory] = useState(
    searchParams.get('category') || 'all',
  );

  const [localAttrs, setLocalAttrs] = useState<Record<string, string>>({});

  const selectedCategoryData = categories.find((c) => c.slug === localCategory);

  // Load attrs từ URL
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
    applyFilters(localCategory, localAttrs, priceRange, sort);
  };

  return (
    <aside className="bg-card sticky top-20 h-fit w-full space-y-5 rounded-lg border p-5 shadow-sm md:w-64">
      {/* Header */}
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

        <CategorySelect
          value={localCategory}
          onChange={setLocalCategory}
          categories={categories}
        />
      </div>

      {/* Dynamic Attributes */}
      <Separator />

      <div className="space-y-4">
        <div className="text-muted-foreground flex items-center gap-2">
          <Settings2 className="h-4 w-4" />
          <h3 className="text-primary text-sm font-semibold uppercase">
            Thông số
          </h3>
        </div>

        <AttributeFilters
          category={selectedCategoryData}
          localAttrs={localAttrs}
          setLocalAttrs={setLocalAttrs}
        />
      </div>

      <Separator />

      {/* Price */}
      <div className="space-y-4">
        <h3 className="text-muted-foreground text-sm font-semibold uppercase">
          Khoảng Giá (₫)
        </h3>

        <PriceRangeSlider
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          min={0}
          max={5000}
        />
      </div>

      <Separator />

      {/* Sort */}
      <SortSelect value={sort} onChange={setSort} />

      {/* Apply button */}
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
'use client';

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Category } from '@/types/category.types';
import { Filter, ListFilter } from 'lucide-react'

import CategorySelect from './CategorySelect';
import PriceRangeSlider from './PriceRangeSlider';
import SortSelect from './SortSelect';
import AttributeSelect from './AttributeSelect';

import { useProductFilterNavigation } from '../hooks/useProductFilterNavigation';
import { DEFAULT_MAX_PRICE } from '@/constants/enum';
import { GetProductsRequest } from '@/types/product.types'

interface FilterBarProps {
  initialCategory: string
  initialAttrs: Record<string, string>
  initialPriceRange: [number, number]
  initialSort: string
  categories: Category[]
}

const FilterSidebar = ({
  initialCategory,
  initialAttrs,
  initialPriceRange,
  initialSort,
  categories,
}: FilterBarProps) => {
  const { applyFilters, resetFilters, defaultPriceMax } =
    useProductFilterNavigation()

  const [localCategory, setLocalCategory] = useState(initialCategory)
  const [localAttrs, setLocalAttrs] =
    useState<Record<string, string>>(initialAttrs)
  const [priceRange, setPriceRange] =
    useState<[number, number]>(initialPriceRange)
  const [sort, setSort] = useState<GetProductsRequest['sort'] | string>(
    initialSort,
  )
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasUserInteractedRef = useRef(false)

  const selectedCategoryData = categories.find((c) => c.slug === localCategory)

  const markUserInteraction = () => {
    hasUserInteractedRef.current = true
  }

  const handleCategoryChange = (value: string) => {
    markUserInteraction()
    setLocalCategory(value)
    setLocalAttrs({})
  }

  const handleAttrsChange = (attrs: Record<string, string>) => {
    markUserInteraction()
    setLocalAttrs(attrs)
  }

  const handlePriceRangeChange = (value: [number, number]) => {
    markUserInteraction()
    setPriceRange(value)
  }

  const handleSortChange = (value: string) => {
    markUserInteraction()
    setSort(value)
  }

  const handleApply = () => {
    applyFilters(localCategory, localAttrs, priceRange, sort)
  }

  const handleReset = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    hasUserInteractedRef.current = false

    setLocalCategory('all')
    setLocalAttrs({})
    setPriceRange([0, defaultPriceMax])
    setSort('')
    resetFilters()
  }

  useEffect(() => {
    if (!hasUserInteractedRef.current) return

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      applyFilters(localCategory, localAttrs, priceRange, sort)
    }, 450)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [localCategory, localAttrs, priceRange, sort, applyFilters])

  return (
    <aside className="sticky top-24 h-fit w-full space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all md:w-64 md:self-start">
      {/* Header */}
      <div className="flex flex-col gap-1 pb-2">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter className="h-4 w-4" />
          <span className="text-[10px] font-bold tracking-wider uppercase">Lọc theo</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Bộ lọc</h2>
      </div>

      {/* Category */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Danh mục</h3>
        <CategorySelect
          value={localCategory}
          onChange={handleCategoryChange}
          categories={categories}
        />
      </div>

      {/* Dynamic Attributes */}
      <div className="space-y-6">
        <AttributeSelect
          category={selectedCategoryData}
          localAttrs={localAttrs}
          setLocalAttrs={handleAttrsChange}
        />
      </div>

      <div className="h-px bg-slate-200/50" />

      {/* Price */}
      <div className="space-y-6">
        <h3 className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          Khoảng Giá (₫)
        </h3>

        <PriceRangeSlider
          priceRange={priceRange}
          setPriceRange={handlePriceRangeChange}
          min={0}
          max={DEFAULT_MAX_PRICE}
        />
      </div>

      <div className="h-px bg-slate-200/50" />

      {/* Sort */}
      <div className="space-y-4">
        <h3 className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Sắp xếp</h3>
        <SortSelect value={sort} onChange={handleSortChange} />
      </div>

      {/* Apply button */}
      <div className="flex flex-col gap-2 pt-2">
        <Button
          className="h-10 w-full rounded-lg bg-slate-900 font-bold text-white transition-all hover:bg-slate-800"
          onClick={handleApply}
        >
          Áp dụng
        </Button>
        <Button 
          variant="ghost" 
          className="h-10 w-full rounded-lg text-slate-500 font-medium hover:bg-slate-50" 
          onClick={handleReset}
        >
          Xóa bộ lọc
        </Button>
      </div>

      <p className="text-center text-[10px] text-slate-400">
        Tự động áp dụng sau khi dừng thao tác
      </p>
    </aside>
  )
}

export default FilterSidebar;
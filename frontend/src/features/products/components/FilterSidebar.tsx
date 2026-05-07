'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Category } from '@/types/category.types'
import { Filter, ListFilter } from 'lucide-react'

import CategorySelect from './CategorySelect'
import PriceRangeSlider from './PriceRangeSlider'
import SortSelect from './SortSelect'
import AttributeSelect from './AttributeSelect'

import { useProductFilterNavigation } from '../hooks/useProductFilterNavigation'
import { DEFAULT_MAX_PRICE } from '@/constants/enum'

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
  const [sort, setSort] = useState<string>(initialSort)
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
    <aside className="glass-sidebar sticky top-24 h-fit w-full space-y-10 md:w-80 md:self-start">
      {/* Header */}
      <div className="flex flex-col gap-2 pb-2">
        <div className="flex items-center gap-2.5 text-blue-600">
          <Filter className="h-4 w-4" strokeWidth={2.5} />
          <span className="font-display text-[10px] font-black tracking-[0.2em] uppercase">
            Bộ lọc nâng cao
          </span>
        </div>
        <h2 className="font-display text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Tùy chọn
        </h2>
      </div>

      <div className="space-y-10">
        {/* Category */}
        <div className="space-y-4">
          <h3 className="font-display text-[11px] font-black tracking-widest text-slate-400 uppercase">
            Danh mục
          </h3>
          <CategorySelect
            value={localCategory}
            onChange={handleCategoryChange}
            categories={categories}
          />
        </div>

        {/* Dynamic Attributes */}
        <AttributeSelect
          category={selectedCategoryData}
          localAttrs={localAttrs}
          setLocalAttrs={handleAttrsChange}
        />

        <div className="h-px bg-slate-100 dark:bg-white/5" />

        {/* Price */}
        <div className="space-y-6">
          <h3 className="font-display text-[11px] font-black tracking-widest text-slate-400 uppercase">
            Khoảng Giá (₫)
          </h3>

          <PriceRangeSlider
            priceRange={priceRange}
            setPriceRange={handlePriceRangeChange}
            min={0}
            max={DEFAULT_MAX_PRICE}
          />
        </div>

        <div className="h-px bg-slate-100 dark:bg-white/5" />

        {/* Sort */}
        <div className="space-y-4">
          <h3 className="font-display text-[11px] font-black tracking-widest text-slate-400 uppercase">
            Sắp xếp theo
          </h3>
          <SortSelect value={sort} onChange={handleSortChange} />
        </div>

        {/* Reset button */}
        <div className="flex flex-col gap-4 pt-6">
          <Button
            variant="outline"
            className="btn-premium-secondary group h-14 w-full"
            onClick={handleReset}
          >
            Xóa tất cả bộ lọc
          </Button>

          <div className="flex items-center justify-center gap-2.5 rounded-full bg-slate-50 py-2 dark:bg-white/5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Tự động áp dụng
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default FilterSidebar

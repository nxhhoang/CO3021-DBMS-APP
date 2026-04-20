'use client';

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
    <aside className="bg-card sticky top-20 h-fit w-full space-y-5 rounded-lg border p-5 shadow-sm md:w-64 md:self-start">
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

      <Separator />

      {/* Price */}
      <div className="space-y-4">
        <h3 className="text-muted-foreground text-sm font-semibold uppercase">
          Khoảng Giá (₫)
        </h3>

        <PriceRangeSlider
          priceRange={priceRange}
          setPriceRange={handlePriceRangeChange}
          min={0}
          max={DEFAULT_MAX_PRICE}
        />
      </div>

      <Separator />

      {/* Sort */}
      <SortSelect value={sort} onChange={handleSortChange} />

      {/* Apply button */}
      <div className="space-y-2">
        <Button
          className="w-full font-bold shadow-blue-200"
          onClick={handleApply}
        >
          ÁP DỤNG
        </Button>
        <Button variant="outline" className="w-full" onClick={handleReset}>
          XÓA BỘ LỌC
        </Button>
      </div>

      <p className="text-muted-foreground text-center text-xs">
        Bộ lọc tự áp dụng sau ~0.45s khi bạn dừng thao tác
      </p>
    </aside>
  )
}

export default FilterSidebar;
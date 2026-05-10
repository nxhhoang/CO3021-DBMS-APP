'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { buildProductFilterParams } from '../utils/buildProductFilterParams'
import { DEFAULT_MAX_PRICE } from '@/constants/enum'

export function useProductFilterNavigation() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const applyFilters = (
    category: string,
    attrs: Record<string, string>,
    priceRange: [number, number],
    sort: string,
  ) => {
    const params = buildProductFilterParams(
      searchParams,
      category,
      attrs,
      priceRange,
      sort,
    )

    const nextQuery = params.toString()
    const currentQuery = searchParams.toString()

    if (nextQuery === currentQuery) return
    router.push(`/products?${nextQuery}`, { scroll: false })
  }

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    params.delete('category')
    params.delete('sort')
    params.delete('priceMin')
    params.delete('priceMax')

    Array.from(params.keys()).forEach((key) => {
      if (key.startsWith('attrs[')) {
        params.delete(key)
      }
    })

    params.set('page', '1')

    const nextQuery = params.toString()
    const currentQuery = searchParams.toString()

    if (nextQuery === currentQuery) return
    router.push(`/products?${nextQuery}`, { scroll: false })
  }

  return { applyFilters, resetFilters, defaultPriceMax: DEFAULT_MAX_PRICE }
}

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { GetProductsRequest } from '@/types/product.types'
import { DEFAULT_MAX_PRICE } from '@/constants/enum'

export default function useProductFilters(params: GetProductsRequest) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState<[number, number]>([
    params.priceMin ?? 0,
    params.priceMax ?? DEFAULT_MAX_PRICE,
  ])

  const [sort, setSort] = useState(params.sort ?? '')

  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams.toString())

    newParams.set('priceMin', String(priceRange[0]))
    newParams.set('priceMax', String(priceRange[1]))

    if (sort) newParams.set('sort', sort)
    else newParams.delete('sort')

    newParams.set('page', '1')

    router.push(`/products?${newParams.toString()}`)
  }

  return {
    priceRange,
    setPriceRange,
    sort,
    setSort,
    applyFilters,
  }
}

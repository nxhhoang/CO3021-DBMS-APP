import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { GetProductsRequest } from '@/types/product.types'
import { SORT_BY } from '@/constants/enum'

function parseSort(value: string | null): GetProductsRequest['sort'] {
  const validSorts = Object.values(SORT_BY) as GetProductsRequest['sort'][]
  return validSorts.includes(value as GetProductsRequest['sort'])
    ? (value as GetProductsRequest['sort'])
    : SORT_BY.POPULARITY // default = soldDESC
}

function parsePositiveNumber(value: string | null) {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}

export default function useProductQueryParams(): GetProductsRequest {
  const searchParams = useSearchParams()

  return useMemo(() => {
    const attrs: Record<string, string> = {}

    // Parse dynamic attrs: attrs[color]=red → { color: 'red' }
    searchParams.forEach((value, key) => {
      const match = key.match(/^attrs\[(.*)\]$/)
      if (match) {
        attrs[match[1]] = value
      }
    })

    const keyword = (searchParams.get('keyword') || '').trim()
    const category = searchParams.get('category') || undefined
    const page = Number(searchParams.get('page'))

    return {
      keyword: keyword || undefined,

      // Nếu có keyword thì bỏ category theo spec API
      category: keyword ? undefined : category,

      page: Number.isFinite(page) && page > 0 ? page : 1,

      // API mặc định 12 sản phẩm / trang
      limit: 12,

      priceMin: parsePositiveNumber(searchParams.get('priceMin')),

      priceMax: parsePositiveNumber(searchParams.get('priceMax')),

      // ✅ FIX: validate sort trước khi dùng
      sort: parseSort(searchParams.get('sort')),

      attrs,
    }
  }, [searchParams])
}

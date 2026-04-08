import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { GetProductsRequest } from '@/types/product.types'
import { SORT_BY } from '@/constants/enum'

function parseSort(value: string | null): GetProductsRequest['sort'] {
  const validSorts = Object.values(SORT_BY)
  return validSorts.includes(value as any)
    ? (value as GetProductsRequest['sort'])
    : SORT_BY.POPULARITY // default = soldDESC
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

    const keyword = searchParams.get('keyword') || ''
    const category = searchParams.get('category') || undefined

    return {
      keyword,

      // Nếu có keyword thì bỏ category theo spec API
      category: keyword ? undefined : category,

      page: Number(searchParams.get('page')) || 1,

      // API mặc định 10 sản phẩm / trang
      limit: 10,

      priceMin: searchParams.get('priceMin')
        ? Number(searchParams.get('priceMin'))
        : undefined,

      priceMax: searchParams.get('priceMax')
        ? Number(searchParams.get('priceMax'))
        : undefined,

      // ✅ FIX: validate sort trước khi dùng
      sort: parseSort(searchParams.get('sort')),

      attrs,
    }
  }, [searchParams])
}

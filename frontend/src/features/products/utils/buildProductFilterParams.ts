import { DEFAULT_MAX_PRICE } from '@/constants/enum'
import { GetProductsRequest } from '@/types/product.types'

export function buildProductFilterParams(
  searchParams: URLSearchParams,
  localCategory: string,
  localAttrs: Record<string, string>,
  priceRange: [number, number],
  sort: GetProductsRequest['sort'] | string,
) {
  const newParams = new URLSearchParams(searchParams.toString())

  // Xóa attrs cũ
  Array.from(newParams.keys()).forEach((key) => {
    if (key.startsWith('attrs[')) {
      newParams.delete(key)
    }
  })

  // Add attrs mới
  Object.entries(localAttrs).forEach(([key, value]) => {
    if (value && value !== 'all') {
      newParams.set(`attrs[${key}]`, value)
    }
  })

  // Category
  if (localCategory && localCategory !== 'all') {
    newParams.set('category', localCategory)
  } else {
    newParams.delete('category')
  }

  // Price
  if (priceRange[0] > 0) {
    newParams.set('priceMin', priceRange[0].toString())
  } else {
    newParams.delete('priceMin')
  }

  if (priceRange[1] < DEFAULT_MAX_PRICE) {
    newParams.set('priceMax', priceRange[1].toString())
  } else {
    newParams.delete('priceMax')
  }

  // Sort
  if (sort) newParams.set('sort', sort)
  else newParams.delete('sort')

  newParams.set('page', '1')

  return newParams
}

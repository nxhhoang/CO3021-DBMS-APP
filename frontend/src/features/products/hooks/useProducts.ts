import { useState, useEffect, useCallback, useRef } from 'react'
import { GetProductsRequest, ProductResponse } from '@/types/product.types'
import { PaginationParams } from '@/types'
import { productService } from '@/services/product.service'

const ATTR_FILTER_FETCH_LIMIT = 100
const ATTR_FILTER_FETCH_CONCURRENCY = 5

function matchesAttributeFilters(
  product: ProductResponse,
  attrs: Record<string, string | number | boolean>,
) {
  return Object.entries(attrs).every(([key, expectedValue]) => {
    const actualValue = product.attributes?.[key]
    if (actualValue === undefined || actualValue === null) return false

    return (
      String(actualValue).toLowerCase() === String(expectedValue).toLowerCase()
    )
  })
}

function useProducts(params: GetProductsRequest) {
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [pagination, setPagination] = useState<PaginationParams | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const latestRequestIdRef = useRef(0)

  const fetchProducts = useCallback(async () => {
    const requestId = latestRequestIdRef.current + 1
    latestRequestIdRef.current = requestId

    try {
      setLoading(true)
      setError(null)

      const attrFilters = params.attrs ?? {}
      const hasAttrFilters = Object.keys(attrFilters).length > 0
      const effectivePage = params.page ?? 1
      const effectiveLimit = params.limit ?? 10

      const response = await productService.getProducts(
        hasAttrFilters
          ? {
              ...params,
              attrs: undefined,
              page: 1,
              limit: ATTR_FILTER_FETCH_LIMIT,
            }
          : params,
      )

      if (latestRequestIdRef.current !== requestId) return

      const result = response?.data

      const firstPageProducts = result?.products ?? []

      if (hasAttrFilters) {
        const totalPages = result?.pagination?.totalPages ?? 1
        const allProducts: ProductResponse[] = [...firstPageProducts]

        if (totalPages > 1) {
          const pages = Array.from(
            { length: totalPages - 1 },
            (_, index) => index + 2,
          )

          for (
            let i = 0;
            i < pages.length;
            i += ATTR_FILTER_FETCH_CONCURRENCY
          ) {
            const batch = pages.slice(i, i + ATTR_FILTER_FETCH_CONCURRENCY)
            const responses = await Promise.all(
              batch.map((page) =>
                productService.getProducts({
                  ...params,
                  attrs: undefined,
                  page,
                  limit: ATTR_FILTER_FETCH_LIMIT,
                }),
              ),
            )

            if (latestRequestIdRef.current !== requestId) return

            responses.forEach((pagedResponse) => {
              allProducts.push(...(pagedResponse.data?.products ?? []))
            })
          }
        }

        const filteredProducts = allProducts.filter((product) =>
          matchesAttributeFilters(product, attrFilters),
        )

        const totalItems = filteredProducts.length
        const totalPagesAfterFilter =
          totalItems > 0 ? Math.ceil(totalItems / effectiveLimit) : 0
        const safeCurrentPage =
          totalPagesAfterFilter > 0
            ? Math.min(effectivePage, totalPagesAfterFilter)
            : 1

        const startIndex = (safeCurrentPage - 1) * effectiveLimit
        const pagedProducts = filteredProducts.slice(
          startIndex,
          startIndex + effectiveLimit,
        )

        setProducts(pagedProducts)
        setPagination({
          totalItems,
          itemCount: pagedProducts.length,
          itemsPerPage: effectiveLimit,
          totalPages: totalPagesAfterFilter,
          currentPage: safeCurrentPage,
          nextPage:
            totalPagesAfterFilter > 0 && safeCurrentPage < totalPagesAfterFilter
              ? safeCurrentPage + 1
              : null,
          hasPrevPage: safeCurrentPage > 1,
          hasNextPage:
            totalPagesAfterFilter > 0 &&
            safeCurrentPage < totalPagesAfterFilter,
        })
      } else {
        setProducts(firstPageProducts)
        setPagination(result?.pagination ?? null)
      }

      setMessage(response.message ?? '')
    } catch (err) {
      if (latestRequestIdRef.current !== requestId) return

      const errorMessage =
        err instanceof Error ? err.message : 'Không thể tải danh sách sản phẩm'
      setError(errorMessage)
      setProducts([])
      setPagination(null)
    } finally {
      if (latestRequestIdRef.current !== requestId) return
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    pagination,
    loading,
    error,
    message,
    refetch: fetchProducts,
  }
}

export default useProducts

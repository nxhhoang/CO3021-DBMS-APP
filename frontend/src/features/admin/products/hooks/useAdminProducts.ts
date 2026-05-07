'use client'

import { useState, FormEvent } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { GetProductsRequest, ProductResponse } from '@/types/product.types'
import {
  useProducts,
  useProductQueryParams,
  useCategories,
} from '@/features/products'
import { SORT_BY } from '@/constants/enum'

type ProductSortValue = Exclude<GetProductsRequest['sort'], undefined>

export function useAdminProducts() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Data Fetching
  const params: GetProductsRequest = useProductQueryParams()
  const { products, pagination, loading, error, refetch } = useProducts(params)
  const { categories, refetch: refetchCategories } = useCategories()

  const [keywordInput, setKeywordInput] = useState(params.keyword ?? '')
  const [categoryFilter, setCategoryFilter] = useState(params.category ?? 'all')
  const [sortFilter, setSortFilter] = useState<ProductSortValue>(
    params.sort ?? SORT_BY.SOLD_DESC,
  )

  // State Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null)

  // Handlers
  const handleEditProduct = (product: ProductResponse) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedProduct(null)
  }

  const handlePageChange = (page: number) => {
    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.set('page', String(page))
    router.push(`${pathname}?${nextParams.toString()}`, { scroll: false })
  }

  const applyFilters = ({
    keyword,
    category,
    sort,
  }: {
    keyword: string
    category: string
    sort: ProductSortValue
  }) => {
    const nextParams = new URLSearchParams(searchParams.toString())

    const normalizedKeyword = keyword.trim()
    if (normalizedKeyword) nextParams.set('keyword', normalizedKeyword)
    else nextParams.delete('keyword')

    if (category && category !== 'all') nextParams.set('category', category)
    else nextParams.delete('category')

    if (sort) nextParams.set('sort', sort)
    else nextParams.delete('sort')

    nextParams.set('page', '1')
    router.push(`${pathname}?${nextParams.toString()}`, { scroll: false })
  }

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    applyFilters({
      keyword: keywordInput,
      category: categoryFilter,
      sort: sortFilter,
    })
  }

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
    applyFilters({
      keyword: keywordInput,
      category: value,
      sort: sortFilter,
    })
  }

  const handleSortChange = (value: string) => {
    const nextSort = value as ProductSortValue
    setSortFilter(nextSort)
    applyFilters({
      keyword: keywordInput,
      category: categoryFilter,
      sort: nextSort,
    })
  }

  const handleResetFilters = () => {
    setKeywordInput('')
    setCategoryFilter('all')
    setSortFilter(SORT_BY.SOLD_DESC)

    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete('keyword')
    nextParams.delete('category')
    nextParams.delete('sort')
    nextParams.delete('page')

    router.push(`${pathname}?${nextParams.toString()}`, { scroll: false })
  }

  return {
    products,
    pagination,
    loading,
    error,
    refetch,
    categories,
    refetchCategories,
    keywordInput,
    setKeywordInput,
    categoryFilter,
    sortFilter,
    isProductModalOpen,
    setIsProductModalOpen,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedProduct,
    handleEditProduct,
    handleCloseEditModal,
    handlePageChange,
    handleSearchSubmit,
    handleCategoryChange,
    handleSortChange,
    handleResetFilters,
    params,
  }
}

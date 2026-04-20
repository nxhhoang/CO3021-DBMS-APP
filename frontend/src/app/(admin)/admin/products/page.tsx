'use client'

import { FormEvent, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FolderPlus, Package, Plus } from 'lucide-react'

// Types & Hooks
import { GetProductsRequest, ProductResponse } from '@/types/product.types'
import useProducts from '@/features/products/hooks/useProducts'
import useProductQueryParams from '@/features/products/hooks/useProductQueryParams'
import useCategories from '@/features/products/hooks/useCategories'
import { SORT_BY } from '@/constants/enum'

// Components
import ProductTable from '@/features/adminProduct/components/ProductTable'
import AddProductModal from '@/features/adminProduct/components/AddProductModal/AddProductModal'
import AddCategoryModal from '@/features/adminProduct/components/AddCategoryModal/AddCategoryModal'
import EditProductModal from '@/features/adminProduct/components/EditProductModal/EditProductModal'

// shadcn
import { Button } from '@/components/ui/button'

type ProductSortValue = Exclude<GetProductsRequest['sort'], undefined>

export default function AdminProductsPage() {
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
    params.sort ?? SORT_BY.POPULARITY,
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
    setSortFilter(SORT_BY.POPULARITY)

    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete('keyword')
    nextParams.delete('category')
    nextParams.delete('sort')
    nextParams.delete('page')

    router.push(`${pathname}?${nextParams.toString()}`, { scroll: false })
  }

  return (
    <div className="bg-surface min-h-screen px-6 py-8">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-on-surface flex items-center gap-3 text-3xl font-extrabold">
            <Package className="text-primary" size={28} />
            Quản lý kho hàng
          </h1>

          <p className="text-on-surface-variant text-sm">
            {params.keyword
              ? `Tìm thấy ${pagination?.totalItems || 0} kết quả cho "${params.keyword}"`
              : `Tổng số sản phẩm: ${pagination?.totalItems || 0}`}
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCategoryModalOpen(true)}
            className="rounded-full px-6"
          >
            <FolderPlus size={18} />
            Thêm danh mục
          </Button>

          <Button
            type="button"
            onClick={() => setIsProductModalOpen(true)}
            className="rounded-full px-8"
          >
            <Plus size={18} />
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-500">
          Không thể tải danh sách sản phẩm: {error}
        </p>
      )}

      {/* MAIN CONTENT */}
      <ProductTable
        products={products}
        loading={loading}
        pagination={pagination}
        categories={categories || []}
        keywordInput={keywordInput}
        categoryFilter={categoryFilter}
        sortFilter={sortFilter}
        onKeywordChange={setKeywordInput}
        onSearchSubmit={handleSearchSubmit}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
        onRefresh={refetch}
        onEdit={handleEditProduct}
        onPageChange={handlePageChange}
      />

      {/* MODALS */}
      <AddProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        categories={categories || []}
        onSuccess={refetch}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        product={selectedProduct}
        categories={categories || []}
        onSuccess={refetch}
      />

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSaved={refetchCategories}
      />
    </div>
  )
}
'use client'

import { FolderPlus, Package, Plus } from 'lucide-react'

// Hooks
import { useAdminProducts } from '@/features/admin/products/hooks/useAdminProducts'

// Components
import ProductTable from '@/features/adminProduct/components/ProductTable'
import AddProductModal from '@/features/adminProduct/components/AddProductModal/AddProductModal'
import AddCategoryModal from '@/features/adminProduct/components/AddCategoryModal/AddCategoryModal'
import EditProductModal from '@/features/adminProduct/components/EditProductModal/EditProductModal'
import { Button } from '@/components/ui/button'

export default function AdminProductsPage() {
  const {
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
    handleEditProduct,
    handleCloseEditModal,
    selectedProduct,
    handlePageChange,
    handleSearchSubmit,
    handleCategoryChange,
    handleSortChange,
    handleResetFilters,
    params,
  } = useAdminProducts()

  return (
    <div className="animate-in fade-in slide-in-from-top-4 duration-700">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Sản phẩm
            </h1>
            <span className="flex h-5 items-center rounded-full bg-blue-50 px-2.5 text-[10px] font-black tracking-widest text-blue-600 uppercase ring-1 ring-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-900/30">
              Quản lý kho hàng
            </span>
          </div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
            {params.keyword
              ? `Tìm thấy ${pagination?.totalItems || 0} kết quả cho "${params.keyword}"`
              : `Tổng số sản phẩm trong hệ thống: ${pagination?.totalItems || 0}`}
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCategoryModalOpen(true)}
            className="btn-premium-secondary rounded-full px-6"
          >
            <FolderPlus size={18} />
            Thêm danh mục
          </Button>

          <Button
            type="button"
            onClick={() => setIsProductModalOpen(true)}
            className="btn-premium-primary rounded-full px-8 shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-500">
          Không thể tải danh sách sản phẩm: {error}
        </p>
      )}

      {/* MAIN CONTENT */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
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
      </div>

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

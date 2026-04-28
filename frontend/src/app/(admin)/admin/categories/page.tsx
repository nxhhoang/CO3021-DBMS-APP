'use client'

import { FolderPlus, FolderTree } from 'lucide-react'

// Components & Hooks
import AddCategoryModal from '@/features/adminProduct/components/AddCategoryModal/AddCategoryModal'
import {
  PremiumTable,
  PremiumTableHeader,
  PremiumTableRow,
  PremiumTableHead,
  PremiumTableContainer,
} from '@/components/common/PremiumTable'
import { LoadingState } from '@/components/common/LoadingState'
import { EmptyState } from '@/components/common/EmptyState'

// Refactored Sub-components
import { CategoryStats } from '@/features/admin/categories/components/CategoryStats'
import { CategoryRow } from '@/features/admin/categories/components/CategoryRow'
import { useAdminCategories } from '@/features/admin/categories/hooks/useAdminCategories'

export default function AdminCategoriesPage() {
  const {
    categories,
    loading,
    selectedCategory,
    isCategoryModalOpen,
    expandedCategoryId,
    updatingStatusIds,
    totalDynamicAttributes,
    totalVariantAttributes,
    getCategoryId,
    toggleCategoryDetails,
    openCreateModal,
    openEditModal,
    handleSavedCategory,
    handleCloseModal,
    handleDeleteCategory,
    handleToggleCategoryStatus,
  } = useAdminCategories()

  return (
    <div className="animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Danh mục
            </h1>
            <span className="flex h-5 items-center rounded-full bg-blue-50 px-2.5 text-[10px] font-black tracking-widest text-blue-600 uppercase ring-1 ring-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-900/30">
              Cấu trúc phân loại
            </span>
          </div>
          <CategoryStats
            totalCategories={categories.length}
            totalDynamicAttributes={totalDynamicAttributes}
            totalVariantAttributes={totalVariantAttributes}
          />
        </div>

        <button
          onClick={openCreateModal}
          className="btn-premium-primary flex h-14 items-center gap-3 px-8 shadow-2xl transition-all hover:scale-105 active:scale-95"
        >
          <FolderPlus size={20} />
          <span>Thêm danh mục</span>
        </button>
      </div>

      <PremiumTableContainer
        title="Danh sách danh mục"
        subtitle="Quản lý cấu trúc phân loại sản phẩm và các thuộc tính động."
      >
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingState message="Đang tải danh mục..." />
          </div>
        ) : categories.length === 0 ? (
          <EmptyState
            icon={FolderTree}
            title="Chưa có danh mục nào"
            description="Hãy bắt đầu bằng cách thêm danh mục mới để phân loại sản phẩm của bạn."
            action={{ label: 'Thêm danh mục', onClick: openCreateModal }}
          />
        ) : (
          <PremiumTable>
            <PremiumTableHeader>
              <PremiumTableRow>
                <PremiumTableHead className="w-16" />
                <PremiumTableHead>Danh mục</PremiumTableHead>
                <PremiumTableHead>Slug</PremiumTableHead>
                <PremiumTableHead>Trạng thái</PremiumTableHead>
                <PremiumTableHead>Cấu trúc</PremiumTableHead>
                <PremiumTableHead className="text-right">
                  Thao tác
                </PremiumTableHead>
              </PremiumTableRow>
            </PremiumTableHeader>

            <tbody>
              {categories.map((category) => {
                const categoryId = getCategoryId(category)
                return (
                  <CategoryRow
                    key={categoryId}
                    category={category}
                    categoryId={categoryId}
                    isExpanded={expandedCategoryId === categoryId}
                    isUpdatingStatus={updatingStatusIds.includes(categoryId)}
                    onToggleExpand={() => toggleCategoryDetails(category)}
                    onToggleStatus={(checked) =>
                      handleToggleCategoryStatus(category, checked)
                    }
                    onEdit={() => openEditModal(category)}
                    onDelete={() => handleDeleteCategory(category)}
                  />
                )
              })}
            </tbody>
          </PremiumTable>
        )}
      </PremiumTableContainer>

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        category={selectedCategory}
        onClose={handleCloseModal}
        onSaved={handleSavedCategory}
      />
    </div>
  )
}

'use client'

import { useState, useEffect, useMemo } from 'react'
import categoryService from '@/services/category.service'
import { Category } from '@/types/category.types'
import { toast } from 'sonner'

export function useAdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    null,
  )
  const [updatingStatusIds, setUpdatingStatusIds] = useState<string[]>([])

  const getCategoryId = (category: Category) => {
    return category._id || category.ID || ''
  }

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await categoryService.getCategories({})
      setCategories(response.data ?? [])
    } catch (error) {
      console.error('Failed to fetch categories', error)
      toast.error('Không thể tải danh sách danh mục')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const totalDynamicAttributes = useMemo(() => {
    return categories.reduce(
      (total, category) => total + category.dynamicAttributes.length,
      0,
    )
  }, [categories])

  const totalVariantAttributes = useMemo(() => {
    return categories.reduce(
      (total, category) => total + (category.variantAttributes?.length || 0),
      0,
    )
  }, [categories])

  const toggleCategoryDetails = (category: Category) => {
    const categoryId = getCategoryId(category)
    setExpandedCategoryId((current) =>
      current === categoryId ? null : categoryId,
    )
  }

  const openCreateModal = () => {
    setSelectedCategory(null)
    setIsCategoryModalOpen(true)
  }

  const openEditModal = (category: Category) => {
    setSelectedCategory(category)
    setIsCategoryModalOpen(true)
  }

  const handleSavedCategory = async () => {
    setIsCategoryModalOpen(false)
    setSelectedCategory(null)
    await fetchCategories()
  }

  const handleCloseModal = () => {
    setIsCategoryModalOpen(false)
    setSelectedCategory(null)
  }

  const handleDeleteCategory = async (category: Category) => {
    const categoryId = getCategoryId(category)
    if (!categoryId) return

    try {
      await categoryService.deleteCategory(categoryId)
      toast.success('Đã xóa danh mục')
      await fetchCategories()
    } catch (error) {
      console.error('Failed to delete category', error)
      toast.error('Không thể xóa danh mục')
    }
  }

  const handleToggleCategoryStatus = async (
    category: Category,
    nextChecked: boolean,
  ) => {
    const categoryId = getCategoryId(category)
    if (!categoryId) return

    setUpdatingStatusIds((current) => [...current, categoryId])

    try {
      await categoryService.updateCategory(categoryId, {
        isActive: nextChecked,
      })

      setCategories((current) =>
        current.map((item) =>
          getCategoryId(item) === categoryId
            ? {
                ...item,
                isActive: nextChecked,
              }
            : item,
        ),
      )
      toast.success(`Đã ${nextChecked ? 'kích hoạt' : 'tạm ẩn'} danh mục`)
    } catch (error) {
      console.error('Failed to update category status', error)
      toast.error('Không thể cập nhật trạng thái')
    } finally {
      setUpdatingStatusIds((current) =>
        current.filter((id) => id !== categoryId),
      )
    }
  }

  return {
    categories,
    loading,
    selectedCategory,
    isCategoryModalOpen,
    expandedCategoryId,
    updatingStatusIds,
    totalDynamicAttributes,
    totalVariantAttributes,
    getCategoryId,
    fetchCategories,
    toggleCategoryDetails,
    openCreateModal,
    openEditModal,
    handleSavedCategory,
    handleCloseModal,
    handleDeleteCategory,
    handleToggleCategoryStatus,
  }
}

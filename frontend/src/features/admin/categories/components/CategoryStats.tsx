'use client'

import React from 'react'

interface CategoryStatsProps {
  totalCategories: number
  totalDynamicAttributes: number
  totalVariantAttributes: number
}

export const CategoryStats = ({
  totalCategories,
  totalDynamicAttributes,
  totalVariantAttributes,
}: CategoryStatsProps) => {
  return (
    <p className="max-w-2xl text-sm font-medium text-slate-500">
      Quản lý hệ thống phân loại sản phẩm. Tổng số:{' '}
      <span className="font-bold text-slate-900">{totalCategories}</span>{' '}
      danh mục |{' '}
      <span className="font-bold text-slate-900">
        {totalDynamicAttributes}
      </span>{' '}
      thuộc tính động |{' '}
      <span className="font-bold text-slate-900">
        {totalVariantAttributes}
      </span>{' '}
      thuộc tính biến thể.
    </p>
  )
}

'use client'

import React, { Fragment } from 'react'
import { Category } from '@/types/category.types'
import {
  PremiumTableCell,
  PremiumTableRow,
} from '@/components/common/PremiumTable'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { ChevronRight, Pencil, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { CategoryDetails } from './CategoryDetails'

interface CategoryRowProps {
  category: Category
  categoryId: string
  isExpanded: boolean
  isUpdatingStatus: boolean
  onToggleExpand: () => void
  onToggleStatus: (checked: boolean) => void
  onEdit: () => void
  onDelete: () => void
}

export const CategoryRow = ({
  category,
  categoryId,
  isExpanded,
  isUpdatingStatus,
  onToggleExpand,
  onToggleStatus,
  onEdit,
  onDelete,
}: CategoryRowProps) => {
  const variantAttributes = category.variantAttributes || []

  return (
    <Fragment>
      <PremiumTableRow
        onClick={onToggleExpand}
        className="cursor-pointer"
      >
        <PremiumTableCell>
          <ChevronRight
            className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
              isExpanded ? 'rotate-90' : 'rotate-0'
            }`}
          />
        </PremiumTableCell>

        <PremiumTableCell className="max-w-60 whitespace-normal">
          <div className="space-y-1">
            <p className="font-display text-sm font-black text-slate-900 dark:text-white">
              {category.name}
            </p>
            <p className="line-clamp-1 text-[11px] font-medium text-slate-500">
              {category.description || 'Không có mô tả'}
            </p>
          </div>
        </PremiumTableCell>

        <PremiumTableCell className="text-xs font-bold text-slate-600 dark:text-slate-400">
          {category.slug}
        </PremiumTableCell>

        <PremiumTableCell onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center gap-3">
            <Switch
              checked={category.isActive}
              disabled={isUpdatingStatus}
              onCheckedChange={onToggleStatus}
              className="checkbox-premium"
            />
            <span
              className={
                category.isActive ? 'glass-badge-blue' : 'glass-badge-red'
              }
            >
              {isUpdatingStatus
                ? 'Đang cập nhật...'
                : category.isActive
                  ? 'Hoạt động'
                  : 'Tạm ẩn'}
            </span>
          </div>
        </PremiumTableCell>

        <PremiumTableCell>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
            Động: {category.dynamicAttributes.length} | Biến thể:{' '}
            {variantAttributes.length}
          </div>
        </PremiumTableCell>

        <PremiumTableCell
          className="text-right"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="icon-box-premium h-9 w-9 text-slate-600 hover:text-blue-600"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="icon-box-premium h-9 w-9 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-3xl border-none shadow-2xl dark:bg-slate-900">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold dark:text-white">Xác nhận xóa danh mục</AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-500">
                    Bạn có chắc chắn muốn xóa danh mục &quot;{category.name}
                    &quot;? Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl border-slate-200 dark:border-white/10 dark:bg-slate-800">Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    className="rounded-xl bg-red-500 font-bold text-white hover:bg-red-600"
                    onClick={onDelete}
                  >
                    Xác nhận
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </PremiumTableCell>
      </PremiumTableRow>

      {isExpanded && (
        <PremiumTableRow>
          <PremiumTableCell colSpan={6} className="bg-slate-50/50 dark:bg-white/5 px-8 py-8">
            <CategoryDetails category={category} />
          </PremiumTableCell>
        </PremiumTableRow>
      )}
    </Fragment>
  )
}

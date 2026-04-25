'use client'

import React, { Fragment } from 'react'
import { Category } from '@/types/category.types'
import { TableCell, TableRow } from '@/components/ui/table'
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
      <TableRow
        onClick={onToggleExpand}
        className="cursor-pointer transition-colors hover:bg-slate-50/30"
      >
        <TableCell>
          <ChevronRight
            className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
              isExpanded ? 'rotate-90' : 'rotate-0'
            }`}
          />
        </TableCell>

        <TableCell className="max-w-60 whitespace-normal">
          <div className="space-y-1 py-4">
            <p className="font-display text-sm font-black text-slate-900">
              {category.name}
            </p>
            <p className="line-clamp-1 text-[11px] font-medium text-slate-500">
              {category.description || 'Không có mô tả'}
            </p>
          </div>
        </TableCell>

        <TableCell className="text-xs font-bold text-slate-600">
          {category.slug}
        </TableCell>

        <TableCell onClick={(event) => event.stopPropagation()}>
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
        </TableCell>

        <TableCell>
          <div className="text-on-surface-variant text-xs">
            Động: {category.dynamicAttributes.length} | Biến thể:{' '}
            {variantAttributes.length}
          </div>
        </TableCell>

        <TableCell
          className="text-right"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              onClick={onEdit}
            >
              <Pencil className="h-4.5 w-4.5" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn xóa danh mục &quot;{category.name}
                    &quot;? Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-600"
                    onClick={onDelete}
                  >
                    Xác nhận
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow>
          <TableCell colSpan={6} className="bg-slate-50/50 px-8 py-8">
            <CategoryDetails category={category} />
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  )
}

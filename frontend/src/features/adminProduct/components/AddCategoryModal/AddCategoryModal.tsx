'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogOverlay,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FolderPlus } from 'lucide-react'

import categoryService from '@/services/category.service'
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  DynamicAttributeInput,
} from '@/types/category.types'
import GeneralInformation from './GeneralInformation'
import AttributeInformation from './AttributeInformation'

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved?: () => void
  category?: Category | null
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onSaved,
  category = null,
}: AddCategoryModalProps) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [attributes, setAttributes] = useState<DynamicAttributeInput[]>([])
  const [variantAttributes, setVariantAttributes] = useState<
    DynamicAttributeInput[]
  >([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setName(category?.name ?? '')
    setSlug(category?.slug ?? '')
    setDescription(category?.description ?? '')
    setAttributes(
      category?.dynamicAttributes?.map((attribute) => ({
        key: attribute.key,
        label: attribute.label,
        dataType: attribute.dataType,
        options: attribute.options?.map((option) => String(option)) ?? [],
      })) ?? [],
    )
    setVariantAttributes(
      category?.variantAttributes?.map((attribute) => ({
        key: attribute.key,
        label: attribute.label,
        dataType: attribute.dataType,
        options: attribute.options?.map((option) => String(option)) ?? [],
      })) ?? [],
    )
  }, [category, isOpen])

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (val: string) => {
    setName(val)
    setSlug(generateSlug(val))
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      if (category) {
        const payload: UpdateCategoryRequest = {
          name,
          slug,
          description,
          dynamicAttributes: attributes,
          variantAttributes,
        }

        const result = await categoryService.updateCategory(
          category._id || category.ID || '',
          payload,
        )
        alert(result.message)
      } else {
        const payload: CreateCategoryRequest = {
          name,
          slug,
          description,
          isActive: true,
          dynamicAttributes: attributes,
          variantAttributes,
        }

        const result = await categoryService.createCategory(payload)
        alert(result.message)
      }

      onSaved?.()
      onClose()
    } catch (error) {
      console.error(error)
      alert(
        category
          ? 'Có lỗi xảy ra khi cập nhật danh mục'
          : 'Có lỗi xảy ra khi tạo danh mục',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-slate-900/40 backdrop-blur-md" />
      <DialogContent className="glass-surface flex h-[90vh] max-h-[850px] flex-col overflow-hidden p-0 sm:max-w-175 lg:max-w-250">
        {/* Header */}
        <DialogHeader className="shrink-0 border-b border-slate-100 px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="icon-box-premium h-12 w-12 border-blue-100 bg-blue-50 text-blue-600">
              <FolderPlus size={24} />
            </div>
            <div>
              <DialogTitle className="font-display text-2xl font-black text-slate-900">
                {category ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-slate-500">
                {category
                  ? 'Chỉnh sửa thông tin và cấu trúc danh mục sản phẩm'
                  : 'Tạo một danh mục sản phẩm mới với các thuộc tính tùy chỉnh'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body - Single Scrollable Area */}
        <div className="scrollbar-premium min-h-0 flex-1 overflow-y-auto px-8 py-6">
          <div className="flex flex-col gap-12">
            <GeneralInformation
              name={name}
              slug={slug}
              description={description}
              onNameChange={handleNameChange}
              onSlugChange={setSlug}
              onDescriptionChange={setDescription}
            />

            <AttributeInformation
              title="Thuộc tính động"
              attributes={attributes}
              setAttributes={setAttributes}
            />

            <AttributeInformation
              title="Thuộc tính biến thể"
              attributes={variantAttributes}
              setAttributes={setVariantAttributes}
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="shrink-0 border-t border-slate-100 bg-slate-50 px-8 py-5">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              className="btn-premium-secondary h-11 px-8"
            >
              Hủy
            </Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="btn-premium-primary h-11 px-10 shadow-lg shadow-slate-900/10"
          >
            {saving ? 'Đang lưu...' : 'Lưu danh mục'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

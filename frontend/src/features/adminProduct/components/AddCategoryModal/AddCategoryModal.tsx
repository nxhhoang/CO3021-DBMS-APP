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
import { FolderPlus, X, Loader2 } from 'lucide-react'

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
      <DialogContent
        showCloseButton={false}
        className="modal-premium-content flex h-[90vh] max-h-[850px] flex-col overflow-hidden sm:max-w-175 lg:max-w-250"
      >
        <button
          type="button"
          onClick={onClose}
          className="modal-close-btn-premium"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Header */}
        <DialogHeader className="modal-premium-header">
          <div className="flex items-center gap-4">
            <div className="icon-box-premium h-12 w-12 border-blue-100 bg-blue-50 text-blue-600">
              <FolderPlus size={24} />
            </div>
            <div>
              <DialogTitle className="modal-premium-title">
                {category ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
              </DialogTitle>
              <DialogDescription className="modal-premium-subtitle">
                {category
                  ? 'Chỉnh sửa thông tin và cấu trúc danh mục sản phẩm'
                  : 'Tạo một danh mục sản phẩm mới với các thuộc tính tùy chỉnh'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body - Single Scrollable Area */}
        <div className="modal-premium-body scrollbar-premium">
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
        <DialogFooter className="modal-premium-footer">
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
            className="btn-premium-primary group relative h-12 min-w-[160px] overflow-hidden px-8 shadow-xl"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                'Lưu danh mục'
              )}
            </span>
            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-blue-600 to-cyan-500 transition-transform duration-500 group-hover:translate-x-0" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

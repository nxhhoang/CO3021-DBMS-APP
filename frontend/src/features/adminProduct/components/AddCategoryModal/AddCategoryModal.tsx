'use client'

import { useState } from 'react'
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

import categoryService from '@/services/category.service'
import { CreateCategoryRequest } from '@/types/category.types'
import GeneralInformation from './GeneralInformation'
import AttributeInformation from './AttributeInformation'

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddCategoryModal({
  isOpen,
  onClose,
}: AddCategoryModalProps) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [attributes, setAttributes] = useState<any[]>([])

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
      const payload: CreateCategoryRequest = {
        name,
        slug,
        description,
        isActive: true,
        dynamicAttributes: attributes,
      }

      const result = await categoryService.createCategory(payload)
      alert(result.message)
      onClose()
    } catch (error) {
      console.error(error)
      alert('Có lỗi xảy ra khi tạo danh mục')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-[#002366]/5 backdrop-blur-md" />
      <DialogContent className="flex h-[90vh] flex-col overflow-hidden sm:max-w-175 lg:max-w-250">
        {/* Header */}
        <DialogHeader className="border-b pb-4 text-2xl font-bold">
          <DialogTitle className="text-2xl font-bold">
            Thêm danh mục mới
          </DialogTitle>
          <DialogDescription className="font-medium">
            Tạo một danh mục sản phẩm mới
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 px-4">
          <GeneralInformation
            name={name}
            slug={slug}
            description={description}
            onNameChange={handleNameChange}
            onSlugChange={setSlug}
            onDescriptionChange={setDescription}
          />

          <AttributeInformation
            attributes={attributes}
            setAttributes={setAttributes}
          />
        </div>

        {/* Footer */}
        <DialogFooter className="shrink-0 border-t px-6 py-5">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Hủy
            </Button>
          </DialogClose>
          <Button onClick={handleSave}>Lưu danh mục</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
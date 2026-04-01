'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  CreateProductRequest,
  CreateProductResponse,
} from '@/types/product.types'
import { Category } from '@/types/category.types'
import ImageUrlPreview from './ImageUrlPreview'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
}

export default function AddProductModal({
  isOpen,
  onClose,
  categories,
}: AddProductModalProps) {
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<CreateProductRequest>({
    name: '',
    categoryID: '',
    basePrice: 0,
    slug: '',
    description: '',
    images: [''],
    attributes: { size: '', material: '' },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...formData,
      images: formData.images.filter((url) => url.trim() !== ''),
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/products`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify(payload),
        },
      )

      const result = (await response.json()) as CreateProductResponse

      if (response.ok) {
        alert(result.message)
        onClose()
        window.location.reload()
      } else {
        alert(result.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm mới</DialogTitle>
        </DialogHeader>

        <FieldGroup onSubmit={handleSubmit}>
          <ImageUrlPreview
            images={formData.images}
            onChange={(newImages) =>
              setFormData({ ...formData, images: newImages })
            }
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Tên sản phẩm</FieldLabel>
              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel>Slug</FieldLabel>
              <Input
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
            </Field>

            <Field>
              <FieldLabel>Giá cơ bản (VNĐ)</FieldLabel>
              <Input
                type="number"
                required
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    basePrice: Number(e.target.value),
                  })
                }
              />
            </Field>

            <Field>
              <FieldLabel>Danh mục</FieldLabel>
              <Select
                required
                value={formData.categoryID}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryID: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field>
            <FieldLabel>Mô tả sản phẩm</FieldLabel>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="min-h-25 resize-none"
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Hủy
            </Button>
          </DialogClose>

          <Button type="submit" disabled={loading} onClick={handleSubmit}>
            {loading ? 'Đang xử lý...' : 'Xác nhận tạo sản phẩm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

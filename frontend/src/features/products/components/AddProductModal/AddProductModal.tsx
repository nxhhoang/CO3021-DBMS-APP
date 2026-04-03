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
    images: [],
    attributes: {},
  })

  // Tìm danh mục đang được chọn để lấy dynamicAttributes
  const selectedCategory = categories.find(
    (cat) => cat._id === formData.categoryID,
  )

  // Hàm cập nhật attribute động
  const handleAttributeChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: value,
      },
    }))
  }

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
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-175 lg:max-w-250">
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
            {/* CỘT TRÁI: Hình ảnh */}
            <div className="space-y-4">
              <ImageUrlPreview
                images={formData.images}
                onChange={(newImages) =>
                  setFormData({ ...formData, images: newImages })
                }
              />
            </div>

            {/* CỘT PHẢI: Thông tin và Thuộc tính */}
            <div className="space-y-6">
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
              </div>

              <div className="grid gap-4 md:grid-cols-2">
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
                      setFormData({
                        ...formData,
                        categoryID: value,
                        attributes: {},
                      })
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

              {/* RENDER DYNAMIC ATTRIBUTES KHI CHỌN CATEGORY */}
              {selectedCategory &&
                selectedCategory.dynamicAttributes.length > 0 && (
                  <div className="border-primary/30 bg-primary/5 rounded-lg border border-dashed p-4">
                    <h3 className="text-primary mb-4 text-xs font-bold tracking-widest uppercase">
                      Thông số: {selectedCategory.name}
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {selectedCategory.dynamicAttributes.map((attr) => (
                        <Field key={attr.key}>
                          <FieldLabel className="text-xs">
                            {attr.label}{' '}
                            {attr.isRequired && (
                              <span className="text-destructive">*</span>
                            )}
                          </FieldLabel>

                          {attr.options && attr.options.length > 0 ? (
                            <Select
                              required={attr.isRequired}
                              value={String(
                                formData.attributes[attr.key] || '',
                              )}
                              onValueChange={(val) =>
                                handleAttributeChange(attr.key, val)
                              }
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Chọn..." />
                              </SelectTrigger>
                              <SelectContent>
                                {attr.options.map((opt) => (
                                  <SelectItem key={opt} value={opt}>
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              className="h-9"
                              type={
                                attr.dataType === 'number' ? 'number' : 'text'
                              }
                              required={attr.isRequired}
                              value={String(
                                formData.attributes[attr.key] ?? '',
                              )}
                              onChange={(e) =>
                                handleAttributeChange(
                                  attr.key,
                                  attr.dataType === 'number'
                                    ? Number(e.target.value)
                                    : e.target.value,
                                )
                              }
                            />
                          )}
                        </Field>
                      ))}
                    </div>
                  </div>
                )}

              <Field>
                <FieldLabel>Mô tả sản phẩm</FieldLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="min-h-[120px] resize-none"
                />
              </Field>
            </div>
          </FieldGroup>

          <DialogFooter className="mt-8">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Hủy
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Xác nhận tạo sản phẩm'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
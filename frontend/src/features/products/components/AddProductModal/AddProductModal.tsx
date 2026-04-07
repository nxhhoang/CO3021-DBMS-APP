'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import ImageUrlPreview from './ImageUrlPreview'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Category } from '@/types/category.types'
import { productSchema } from './schema'
import { productService } from '@/services/product.service'

/** ---------- Zod Schema ---------- */

export type ProductFormValues = z.infer<typeof productSchema>

/** ---------- Component ---------- */
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

  const getCategoryId = (category: Category) =>
    category._id || category.ID || ''

  const toSelectValue = (value: unknown) => {
    if (value === undefined || value === null || value === '') return undefined
    return String(value)
  }

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      categoryID: '',
      basePrice: 0,
      slug: '',
      description: '',
      images: [],
      attributes: {},
    },
  })

  const selectedCategory = categories.find(
    (cat) => getCategoryId(cat) === watch('categoryID'),
  )

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true)
    try {
      // Chuẩn hóa dữ liệu hình ảnh
      const payload = {
        ...data,
        images: data.images.filter((url) => url.trim() !== ''),
      }

      // Gọi API qua ProductService
      const res = await productService.createProduct(payload)

      // Thông báo thành công
      alert(res.message || 'Tạo sản phẩm thành công!')
      onClose() // Đóng modal
      window.location.reload() // Tải lại trang để cập nhật danh sách
    } catch (error: any) {
      // Xử lý lỗi
      const errorMsg =
        error.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm'
      alert(errorMsg)
      console.error('Create Product Error:', error)
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* CỘT TRÁI: Hình ảnh */}
            <div className="space-y-4">
              <Controller
                control={control}
                name="images"
                render={({ field }) => (
                  <ImageUrlPreview
                    images={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.images && (
                <FieldError>{errors.images.message}</FieldError>
              )}
            </div>

            {/* CỘT PHẢI: Thông tin và Thuộc tính */}
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel>Tên sản phẩm</FieldLabel>
                  <Input {...register('name')} />
                  {errors.name && (
                    <FieldError>{errors.name.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Slug</FieldLabel>
                  <Input {...register('slug')} />
                  {errors.slug && (
                    <FieldError>{errors.slug.message}</FieldError>
                  )}
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel>Giá cơ bản (VNĐ)</FieldLabel>
                  <Input type="number" {...register('basePrice')} />
                  {errors.basePrice && (
                    <FieldError>{errors.basePrice.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Danh mục</FieldLabel>
                  <Controller
                    control={control}
                    name="categoryID"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem
                              key={getCategoryId(cat)}
                              value={getCategoryId(cat)}
                            >
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.categoryID && (
                    <FieldError>{errors.categoryID.message}</FieldError>
                  )}
                </Field>
              </div>

              {/* Dynamic attributes */}
              {selectedCategory &&
                selectedCategory.dynamicAttributes.length > 0 && (
                  <div className="border-primary/30 bg-primary/5 rounded-lg border border-dashed p-4">
                    <h3 className="text-primary mb-2 text-xs font-bold tracking-widest uppercase">
                      Thông số: {selectedCategory.name}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-xs">
                      Điền các thuộc tính động theo danh mục đã chọn.
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      {selectedCategory.dynamicAttributes.map((attr) => (
                        <Field key={attr.key}>
                          <FieldLabel>
                            {attr.label || attr.key}
                            {attr.isRequired ? ' *' : ''}
                          </FieldLabel>
                          <Controller
                            control={control}
                            name={`attributes.${attr.key}`}
                            render={({ field }) => {
                              if (attr.options?.length) {
                                return (
                                  <Select
                                    value={toSelectValue(field.value)}
                                    onValueChange={(value) => {
                                      if (attr.dataType === 'number') {
                                        field.onChange(Number(value))
                                        return
                                      }

                                      if (attr.dataType === 'boolean') {
                                        field.onChange(value === 'true')
                                        return
                                      }

                                      field.onChange(value)
                                    }}
                                  >
                                    <SelectTrigger className="h-9 w-full">
                                      <SelectValue
                                        placeholder={`Chọn ${attr.label || attr.key}`}
                                      />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {attr.options.map((opt) => (
                                        <SelectItem key={opt} value={opt}>
                                          {opt}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )
                              }

                              if (attr.dataType === 'boolean') {
                                return (
                                  <Select
                                    value={toSelectValue(field.value)}
                                    onValueChange={(value) => {
                                      field.onChange(value === 'true')
                                    }}
                                  >
                                    <SelectTrigger className="h-9 w-full">
                                      <SelectValue
                                        placeholder={`Chọn ${attr.label || attr.key}`}
                                      />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="true">Có</SelectItem>
                                      <SelectItem value="false">
                                        Không
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                )
                              }

                              return (
                                <Input
                                  className="h-9"
                                  type={
                                    attr.dataType === 'number'
                                      ? 'number'
                                      : 'text'
                                  }
                                  value={field.value ?? ''}
                                  placeholder={`Nhập ${attr.label || attr.key}`}
                                  onChange={(event) => {
                                    const nextValue = event.target.value
                                    if (attr.dataType === 'number') {
                                      field.onChange(
                                        nextValue === ''
                                          ? ''
                                          : Number(nextValue),
                                      )
                                      return
                                    }
                                    field.onChange(nextValue)
                                  }}
                                />
                              )
                            }}
                          />
                        </Field>
                      ))}
                    </div>
                  </div>
                )}

              <Field>
                <FieldLabel>Mô tả sản phẩm</FieldLabel>
                <Textarea
                  {...register('description')}
                  className="min-h-30 resize-none"
                />
                {errors.description && (
                  <FieldError>{errors.description.message}</FieldError>
                )}
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
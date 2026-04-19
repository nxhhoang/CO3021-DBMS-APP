'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ProductResponse, UpdateProductRequest } from '@/types'
import { Category } from '@/types/category.types'
import { productService } from '@/services/product.service'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: ProductResponse | null
  categories: Category[]
  onSuccess: () => void
}

export default function EditProductModal({
  isOpen,
  onClose,
  product,
  categories,
  onSuccess,
}: EditProductModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<UpdateProductRequest>()

  // Reset form khi product thay đổi
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        basePrice: product.basePrice,
        description: product.description,
      })

      // set riêng vì Select không dùng register trực tiếp
      setValue('categoryID', product.category?._id)
    }
  }, [product, reset, setValue])

  const onSubmit = async (data: UpdateProductRequest) => {
    if (!product?._id) return

    try {
      await productService.updateProduct({
        productId: product._id,
        data,
      })
      toast.success('Cập nhật sản phẩm thành công!')
      onSuccess()
      onClose()
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi cập nhật sản phẩm')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa sản phẩm: {product?.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Tên sản phẩm */}
          <Field>
            <FieldLabel>Tên sản phẩm</FieldLabel>
            <Input {...register('name', { required: true })} />
          </Field>

          <FieldGroup className="grid grid-cols-2 gap-4">
            {/* Danh mục */}
            <Field>
              <FieldLabel>Danh mục</FieldLabel>
              <Select
                defaultValue={product?.category?._id}
                onValueChange={(value) => setValue('categoryID', value)}
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

            {/* Giá */}
            <Field>
              <FieldLabel>Giá cơ bản</FieldLabel>
              <Input
                type="number"
                {...register('basePrice', { valueAsNumber: true })}
              />
            </Field>
          </FieldGroup>

          {/* Mô tả */}
          <Field>
            <FieldLabel>Mô tả</FieldLabel>
            <Textarea {...register('description')} />
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

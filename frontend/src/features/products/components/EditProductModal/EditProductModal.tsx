'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ProductResponse, UpdateProductRequest } from '@/types' // Điều chỉnh path import theo dự án của bạn
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

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
    formState: { isSubmitting },
  } = useForm<UpdateProductRequest>()

  // Reset form khi product thay đổi
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        // Lưu ý: ProductResponse không có categoryID trực tiếp,
        // ta lấy từ object category._id
        categoryID: product.category?._id,
        basePrice: product.basePrice,
        description: product.description,
        slug: product.slug,
        // 'stock' không có trong UpdateProductRequest nên ta không register nó
      })
    }
  }, [product, reset])

  const onSubmit = async (data: UpdateProductRequest) => {
    if (!product?._id) return

    try {
      await productService.updateProduct({
        id: product._id,
        data: data,
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa sản phẩm: {product?.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Tên sản phẩm */}
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Tên sản phẩm</Label>
            <Input
              id="edit-name"
              {...register('name', { required: 'Tên không được để trống' })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Danh mục */}
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Danh mục</Label>
              <select
                id="edit-category"
                className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                {...register('categoryID', {
                  required: 'Vui lòng chọn danh mục',
                })}
              >
                <option value="">Chọn danh mục</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Giá cơ bản */}
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Giá cơ bản</Label>
              <Input
                id="edit-price"
                type="number"
                {...register('basePrice', { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Slug */}
          <div className="grid gap-2">
            <Label htmlFor="edit-slug">Slug</Label>
            <Input id="edit-slug" {...register('slug')} />
          </div>

          {/* Mô tả */}
          <div className="grid gap-2">
            <Label htmlFor="edit-description">Mô tả sản phẩm</Label>
            <Textarea
              id="edit-description"
              rows={4}
              {...register('description')}
            />
          </div>

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
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật sản phẩm'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

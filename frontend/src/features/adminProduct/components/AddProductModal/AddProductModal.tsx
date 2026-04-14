'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ImageUrlPreview from './ImageUrlPreview'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'

import { FieldGroup, FieldError } from '@/components/ui/field'

import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Category } from '@/types/category.types'
import {
  productSchema,
  type ProductFormInput,
  type ProductFormValues,
} from '../schema'
import { productService } from '@/services/product.service'
import GeneralInformation from './GeneralInformation'
import CategorySelect from './CategorySelect'

/** ---------- Types ---------- */

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  onSuccess: () => void
}

/** ---------- Component ---------- */
export default function AddProductModal({
  isOpen,
  onClose,
  categories,
  onSuccess,
}: AddProductModalProps) {
  const [loading, setLoading] = useState(false)

  const getCategoryId = (category: Category) =>
    category._id || category.ID || ''

  const toSelectValue = (value: unknown) => {
    if (value === undefined || value === null || value === '') return undefined
    return String(value)
  }

  /** Default values typed properly */
  const defaultValues: ProductFormInput = {
    name: '',
    categoryID: '',
    basePrice: 0,
    slug: '',
    description: '',
    images: [],
    attributes: {},
  }

  /** useForm with proper typing */
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  const selectedCategory = categories.find(
    (cat) => getCategoryId(cat) === watch('categoryID'),
  )

  /** Submit handler */
  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    setLoading(true)
    try {
      const payload = {
        ...data,
        images: (data.images || []).filter((url) => url.trim() !== ''),
      }

      const res = await productService.createProduct(payload)

      if (res.data) {
        toast.success('Tạo sản phẩm thành công!')
        reset()
        onSuccess()
        onClose()
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm'
      toast.error(errorMsg)
      console.error('Create Product Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] sm:max-w-175 lg:max-w-350">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Thêm sản phẩm mới
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="h-[75vh]">
            <FieldGroup className="grid h-full grid-cols-1 gap-10 lg:grid-cols-2">
              {/* CỘT TRÁI: Hình ảnh */}
              <div className="overflow-y-auto pr-2">
                <Controller
                  control={control}
                  name="images"
                  render={({ field }) => (
                    <ImageUrlPreview
                      images={field.value || []}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.images && (
                  <FieldError>{errors.images.message}</FieldError>
                )}
              </div>

              {/* CỘT PHẢI: Thông tin và Thuộc tính */}
              <div className="space-y-6 overflow-y-auto pr-2">
                <GeneralInformation register={register} errors={errors} />
                <CategorySelect
                  control={control}
                  errors={errors}
                  categories={categories}
                  watch={watch}
                />
              </div>
            </FieldGroup>
          </div>

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
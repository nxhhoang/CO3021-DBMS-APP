'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import ImageUrlPreview from './ImageUrlPreview'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
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
import { Badge } from '@/components/ui/badge'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  onSuccess: () => void
}

const initialProductValues: ProductFormInput = {
  name: '',
  categoryID: '',
  basePrice: 0,
  slug: '',
  description: '',
  images: [],
  attributes: {},
}

export default function AddProductModal({
  isOpen,
  onClose,
  categories,
  onSuccess,
}: AddProductModalProps) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialProductValues,
  })

  useEffect(() => {
    if (isOpen) {
      reset(initialProductValues)
      setLoading(false)
    }
  }, [isOpen, reset])

  const handleClose = () => {
    reset(initialProductValues)
    setLoading(false)
    onClose()
  }

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
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose()
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] max-w-[98vw] overflow-hidden rounded-[32px] border-none p-0 shadow-2xl lg:max-w-352"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative grid h-[min(90dvh,920px)] min-h-0 grid-cols-1 items-stretch bg-white lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 z-20 rounded-full border border-slate-200 bg-white/90 p-2 shadow-sm backdrop-blur transition-colors hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>

          <section className="flex min-h-0 min-w-0 flex-col gap-6 border-b border-slate-100 bg-linear-to-b from-slate-50 to-white p-6 sm:p-8 lg:border-r lg:border-b-0 lg:p-10">
            <header className="space-y-3">
              <p className="text-[10px] font-bold tracking-[0.24em] text-slate-400 uppercase">
                Product Visuals
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[2rem]">
                Visual-first setup
              </h2>
              <p className="max-w-md text-sm leading-6 text-slate-500">
                Add the primary image first so the rest of the form feels
                anchored and easier to review.
              </p>
            </header>

            <div className="space-y-6">
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
                <p className="text-xs text-red-500">{errors.images.message}</p>
              )}
            </div>
          </section>

          <section className="flex min-h-0 min-w-0 flex-col overflow-y-auto p-6 sm:p-8 lg:p-10">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.24em] text-slate-400 uppercase">
                  Product Details
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[2rem]">
                  General Information
                </h2>
              </div>
              <Badge
                variant="secondary"
                className="border-none bg-[#E2E4FF] px-3 py-1 text-[10px] font-bold text-[#5851D8] uppercase"
              >
                Required
              </Badge>
            </div>

            <div className="flex min-h-0 flex-1 flex-col space-y-8">
              <div className="rounded-[28px] border border-slate-100 bg-slate-100/70 p-5 sm:p-6">
                <GeneralInformation register={register} errors={errors} />
              </div>

              <div className="rounded-[28px] border border-slate-100 bg-slate-100/70 p-5 sm:p-6">
                <CategorySelect
                  control={control}
                  errors={errors}
                  categories={categories}
                  watch={watch}
                  setValue={setValue}
                />
              </div>

              <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Review the required fields, then publish when the product is
                  ready.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="rounded-2xl bg-[#1A1A1A] px-8 py-6 text-base text-white transition-all hover:bg-black"
                  >
                    {loading ? 'Processing...' : 'Confirm and Publish'}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </form>
      </DialogContent>
    </Dialog>
  )
}
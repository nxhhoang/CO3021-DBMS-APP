'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import ImageUrlPreview from './ImageUrlPreview'
import { toast } from 'sonner'
import { X, Package, Loader2 } from 'lucide-react'
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
import SkuFormSection, { LocalSku } from './SkuFormSection'

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
  const [skus, setSkus] = useState<LocalSku[]>([])

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

  const selectedCategoryId = watch('categoryID')
  const basePrice = watch('basePrice')

  useEffect(() => {
    if (isOpen) {
      reset(initialProductValues)
      setSkus([])
      setLoading(false)
    }
  }, [isOpen, reset])

  const handleClose = () => {
    reset(initialProductValues)
    setSkus([])
    setLoading(false)
    onClose()
  }

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    setLoading(true)
    try {
      const payload = {
        ...data,
        images: (data.images || []).filter((url) => url.trim() !== ''),
        skus: skus,
      }
      const res = await productService.createProduct(payload as any)
      if (res.data) {
        toast.success('Tạo sản phẩm và các biến thể thành công!')
        reset()
        setSkus([])
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
        <div className="relative flex h-[min(90dvh,920px)] min-h-0 flex-col bg-white lg:flex-row">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 z-20 rounded-full border border-slate-200 bg-white/90 p-2 shadow-sm backdrop-blur transition-colors hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>

          {/* LEFT COLUMN - Visuals */}
          <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-6 border-b border-slate-100 bg-linear-to-b from-slate-50 to-white p-6 sm:p-8 lg:max-w-[40%] lg:border-r lg:border-b-0 lg:p-10">
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

            <div className="scrollbar-premium flex-1 overflow-y-auto pr-2">
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
                  <p className="text-xs text-red-500">
                    {errors.images.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN - Form & SKU Creation */}
          <section className="scrollbar-premium flex min-h-0 min-w-0 flex-[1.5] flex-col overflow-y-auto p-6 sm:p-8 lg:p-10">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.24em] text-slate-400 uppercase">
                  Product Details
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[2rem]">
                  Create Product
                </h2>
              </div>
              <Badge
                variant="secondary"
                className="border-none bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-600 uppercase"
              >
                New Entry
              </Badge>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <div className="space-y-8">
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

                <div className="rounded-[32px] border border-slate-100 bg-slate-50/50 p-6 sm:p-8">
                  <SkuFormSection
                    skus={skus}
                    setSkus={setSkus}
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    basePrice={basePrice}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Review all fields and SKU variations before publishing.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="rounded-2xl bg-[#1A1A1A] px-8 py-6 text-base text-white transition-all hover:bg-black active:scale-95"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      'Confirm and Publish'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
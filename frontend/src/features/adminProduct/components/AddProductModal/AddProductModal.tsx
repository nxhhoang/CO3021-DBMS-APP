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
  const basePrice = Number(watch('basePrice') ?? 0)

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
        className="modal-premium-content max-h-[calc(100dvh-2rem)] max-w-[98vw] overflow-hidden lg:max-w-352"
      >
        <button
          type="button"
          onClick={handleClose}
          className="modal-close-btn-premium"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="relative flex h-[min(90dvh,920px)] min-h-0 flex-col bg-white dark:bg-slate-900 lg:flex-row">
          {/* LEFT COLUMN - Visuals */}
          <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-8 border-b border-slate-100 bg-linear-to-b from-slate-50 to-white p-6 sm:p-8 dark:border-white/10 dark:from-slate-800/50 dark:to-slate-900 lg:max-w-[40%] lg:border-r lg:border-b-0 lg:p-10">
            <header className="space-y-4">
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-black tracking-[0.24em] text-slate-400 uppercase">
                  Product Visuals
                </p>
                <h2 className="font-display text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  Visual-first setup
                </h2>
              </div>
              <p className="modal-premium-subtitle text-base leading-relaxed">
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
                  <p className="text-xs font-bold text-rose-500">
                    {errors.images.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN - Form & SKU Creation */}
          <section className="scrollbar-premium flex min-h-0 min-w-0 flex-[1.5] flex-col overflow-y-auto p-6 sm:p-8 lg:p-10">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <p className="text-[10px] font-black tracking-[0.24em] text-slate-400 uppercase">
                  Product Details
                </p>
                <h2 className="font-display text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  Create Product
                </h2>
              </div>
              <Badge className="glass-badge-blue border-none px-4 py-2 text-[10px] font-black tracking-widest uppercase">
                New Entry
              </Badge>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
              <div className="space-y-8">
                <div className="rounded-3xl border border-slate-100 bg-white/60 p-6 backdrop-blur-sm dark:border-white/5 dark:bg-slate-800/40">
                  <GeneralInformation register={register} errors={errors} />
                </div>

                <div className="rounded-3xl border border-slate-100 bg-white/60 p-6 backdrop-blur-sm dark:border-white/5 dark:bg-slate-800/40">
                  <CategorySelect
                    control={control}
                    errors={errors}
                    categories={categories}
                    setValue={setValue}
                  />
                </div>

                <div className="rounded-3xl border border-slate-100 bg-white/60 p-8 backdrop-blur-sm dark:border-white/5 dark:bg-slate-800/40">
                  <SkuFormSection
                    skus={skus}
                    setSkus={setSkus}
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    basePrice={basePrice}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-6 border-t border-slate-100 pt-8 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xs text-sm font-medium text-slate-500">
                  Review all fields and SKU variations before publishing.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="btn-premium-primary group relative h-14 min-w-[200px] overflow-hidden px-8 text-base shadow-xl"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        'Confirm and Publish'
                      )}
                    </span>
                    <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-blue-600 to-cyan-500 transition-transform duration-500 group-hover:translate-x-0" />
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

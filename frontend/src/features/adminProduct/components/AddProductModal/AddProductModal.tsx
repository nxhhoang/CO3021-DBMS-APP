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
        className="modal-premium-content h-[min(90dvh,850px)] w-full max-w-[98vw] overflow-hidden border border-slate-200 shadow-2xl sm:rounded-[32px] lg:max-w-6xl dark:border-white/5 dark:bg-slate-900"
      >
        <button
          type="button"
          onClick={handleClose}
          className="modal-close-btn-premium"
        >
          <X size={18} strokeWidth={3} />
        </button>

        <div className="flex h-full min-h-0 flex-col overflow-hidden lg:flex-row">
          {/* LEFT COLUMN - Visuals */}
          <section className="flex min-h-0 flex-col border-b border-slate-100 bg-slate-50/50 p-6 sm:p-8 dark:border-white/5 dark:bg-white/5 lg:w-[380px] lg:border-r lg:border-b-0 lg:p-8">
            <header className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg dark:bg-blue-600">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Hình ảnh
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Product Visuals
                </p>
              </div>
            </header>

            <div className="scrollbar-premium flex-1 overflow-y-auto pr-2">
              <div className="space-y-4">
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
                  <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                    {errors.images.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN - Form & SKU Creation */}
          <section className="flex min-h-0 flex-1 flex-col bg-white dark:bg-slate-900">
            <div className="shrink-0 flex items-center justify-between border-b border-slate-50 bg-white px-8 py-6 dark:border-white/5 dark:bg-slate-900 sm:px-10">
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Tạo sản phẩm mới
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Add new entry to inventory
                </p>
              </div>
            </div>

            <div className="scrollbar-premium flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-8 sm:p-10">
                <div className="flex-1 space-y-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-px w-6 bg-blue-600" />
                      <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Thông tin cơ bản
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs dark:border-white/5 dark:bg-white/5">
                      <GeneralInformation register={register} errors={errors} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-px w-6 bg-blue-600" />
                      <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Phân loại & Thuộc tính
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs dark:border-white/5 dark:bg-white/5">
                      <CategorySelect
                        control={control}
                        errors={errors}
                        categories={categories}
                        setValue={setValue}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-px w-6 bg-blue-600" />
                      <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Biến thể & Tồn kho
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs dark:border-white/5 dark:bg-white/5">
                      <SkuFormSection
                        skus={skus}
                        setSkus={setSkus}
                        categories={categories}
                        selectedCategoryId={selectedCategoryId}
                        basePrice={basePrice}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8 dark:border-white/10">
                  <p className="max-w-[200px] text-[11px] font-medium leading-relaxed text-slate-400">
                    Kiểm tra kỹ các thuộc tính và SKU trước khi xuất bản.
                  </p>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleClose}
                      className="h-12 rounded-xl px-6 text-[10px] font-black tracking-widest text-slate-400 uppercase hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="h-12 min-w-[180px] rounded-xl bg-blue-600 px-8 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Xuất bản sản phẩm'
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

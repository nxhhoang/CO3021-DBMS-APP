import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import ImageUrlPreview from '../AddProductModal/ImageUrlPreview'
import { toast } from 'sonner'
import { X, Loader2, Package } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Category } from '@/types/category.types'
import { ProductResponse, ProductDetail } from '@/types/product.types'
import {
  productSchema,
  type ProductFormInput,
  type ProductFormValues,
} from '../schema'
import { productService } from '@/services/product.service'
import GeneralInformation from '../AddProductModal/GeneralInformation'
import CategorySelect from '../AddProductModal/CategorySelect'
import { Badge } from '@/components/ui/badge'
import SkuManagement from './SkuManagement'

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
  const [loading, setLoading] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<ProductDetail | null>(
    null,
  )
  const [refreshing, setRefreshing] = useState(false)

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
  })

  const fetchLatestDetails = useCallback(async (id: string) => {
    setRefreshing(true)
    try {
      const res = await productService.getProductDetail({ productId: id })
      if (res.data) {
        setCurrentProduct(res.data)
      }
    } catch (error) {
      console.error('Error fetching product details:', error)
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen && product) {
      setCurrentProduct(product as any)
      reset({
        name: product.name,
        categoryID: product.category?._id || '',
        basePrice: product.basePrice,
        slug: product.slug,
        description: product.description,
        images: product.images || [],
        attributes: product.attributes || {},
      })
      setLoading(false)
      fetchLatestDetails(product._id)
    }
  }, [isOpen, product, reset, fetchLatestDetails])

  const handleClose = () => {
    setLoading(false)
    onClose()
  }

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    if (!product?._id) return
    setLoading(true)
    try {
      const payload = {
        ...data,
        images: (data.images || []).filter((url) => url.trim() !== ''),
      }
      const res = await productService.updateProduct({
        productId: product._id,
        data: payload,
      })
      if (res.data) {
        toast.success('Cập nhật sản phẩm thành công!')
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

          {/* RIGHT COLUMN - Form & SKU Management */}
          <section className="flex min-h-0 flex-1 flex-col bg-white dark:bg-slate-900">
            <div className="shrink-0 flex items-center border-b border-slate-50 bg-white px-8 py-6 dark:border-white/5 dark:bg-slate-900 sm:px-10">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Chỉnh sửa sản phẩm
                  </h2>
                  <Badge className="rounded-full bg-blue-50 px-3 py-1 text-[9px] font-black tracking-widest text-blue-600 uppercase dark:bg-blue-500/10 dark:text-blue-400">
                    ID: {product?._id.slice(-8).toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Management Mode
                  </p>
                  {refreshing && (
                    <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                  )}
                </div>
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
                  {/* SKU Management Section */}
                  {currentProduct && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="h-px w-6 bg-blue-600" />
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          Quản lý biến thể
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs dark:border-white/5 dark:bg-white/5">
                        <SkuManagement
                          product={currentProduct}
                          categories={categories}
                          onRefresh={() => fetchLatestDetails(currentProduct._id)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8 dark:border-white/10">
                  <p className="max-w-[200px] text-[11px] font-medium leading-relaxed text-slate-400">
                    Lưu ý: Các thay đổi sẽ được áp dụng ngay lập tức trên cửa hàng.
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
                        'Lưu thay đổi'
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

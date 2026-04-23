import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import ImageUrlPreview from '../AddProductModal/ImageUrlPreview'
import { toast } from 'sonner'
import { X, Loader2 } from 'lucide-react'
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
                Edit visuals
              </h2>
              <p className="max-w-md text-sm leading-6 text-slate-500">
                Update product images. High-quality visuals are essential for
                conversion and brand perception.
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

          {/* RIGHT COLUMN - Form & SKU Management */}
          <section className="scrollbar-premium flex min-h-0 min-w-0 flex-[1.5] flex-col overflow-y-auto p-6 sm:p-8 lg:p-10">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.24em] text-slate-400 uppercase">
                  Product Details
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[2rem]">
                  Edit Product
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {refreshing && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
                <Badge
                  variant="secondary"
                  className="border-none bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-600 uppercase"
                >
                  ID: {product?._id.slice(-8).toUpperCase()}
                </Badge>
              </div>
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
              </div>

              {/* SKU Management Section */}
              {currentProduct && (
                <div className="rounded-[32px] border border-slate-100 bg-slate-50/50 p-6 sm:p-8">
                  <SkuManagement
                    product={currentProduct}
                    categories={categories}
                    onRefresh={() => fetchLatestDetails(currentProduct._id)}
                  />
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Update the information above and save your changes.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="rounded-2xl bg-[#1A1A1A] px-8 py-6 text-base text-white transition-all hover:bg-black"
                  >
                    {loading ? 'Updating...' : 'Save Changes'}
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

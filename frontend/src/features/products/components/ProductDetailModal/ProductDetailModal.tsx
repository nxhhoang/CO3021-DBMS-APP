'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Loader2,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

import { productService } from '@/services/product.service'
import reviewService from '@/services/review.service'
import { ProductDetail, Inventory, Review } from '@/types'
import formatVND from '@/features/cart/utils/formatVND'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { CartItem } from '@/types/cart.types'

import { ImageGallery } from './ImageGallery'
import { ProductHeader } from './ProductHeader'
import { ProductInfoTab } from './ProductInfoTab'
import { ProductReviewsTab } from './ProductReviewsTab'

interface ProductDetailModalProps {
  productId: string
  isOpen: boolean
  onClose: () => void
}

export const ProductDetailModal = ({
  productId,
  isOpen,
  onClose,
}: ProductDetailModalProps) => {
  const setItems = useCartStore((state) => state.setItems)
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedSku, setSelectedSku] = useState<Inventory | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info')

  const getSkuDisplayPrice = (item: Inventory | null) => {
    return item?.skuPrice ?? item?.sku_price ?? product?.basePrice ?? 0
  }

  const formatReviewDate = (isoDate: string) => {
    const date = new Date(isoDate)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const fetchReviews = async () => {
    if (!productId) return
    setReviewsLoading(true)
    try {
      const response = await reviewService.getReviews({ productId })
      setReviews(response.data || [])
    } catch (error) {
      console.error(error)
      setReviews([])
      toast.error('Không thể tải đánh giá sản phẩm')
    } finally {
      setReviewsLoading(false)
    }
  }

  // Fetch product detail
  useEffect(() => {
    if (!isOpen || !productId) {
      setProduct(null)
      setSelectedSku(null)
      setQuantity(1)
      setActiveImageIndex(0)
      setReviews([])
      setReviewRating(5)
      setReviewComment('')
      return
    }

    const fetchDetail = async () => {
      setLoading(true)
      setReviewsLoading(true)
      try {
        const [productResponse, reviewsResponse] = await Promise.all([
          productService.getProductDetail({ productId }),
          reviewService.getReviews({ productId }),
        ])

        if (productResponse.data) {
          setProduct(productResponse.data)
          const firstInStock = productResponse.data.inventory?.find(
            (item) => item.stockQuantity > 0,
          )
          setSelectedSku(
            firstInStock ?? productResponse.data.inventory?.[0] ?? null,
          )
        }

        setReviews(reviewsResponse.data || [])
      } catch (error) {
        console.error(error)
        toast.error('Không thể tải thông tin sản phẩm')
        onClose()
      } finally {
        setLoading(false)
        setReviewsLoading(false)
      }
    }

    fetchDetail()
  }, [isOpen, productId, onClose])

  useEffect(() => setQuantity(1), [selectedSku])

  useEffect(() => {
    if (!selectedSku) return
    setQuantity((prev) =>
      Math.min(Math.max(prev, 1), selectedSku.stockQuantity || 1),
    )
  }, [selectedSku])

  // Add to cart
  const handleAddToCart = () => {
    if (!product || !selectedSku) return
    if (selectedSku.stockQuantity <= 0) {
      toast.error('Phiên bản đã chọn hiện đang hết hàng')
      return
    }

    try {
      const cartKey = 'cart'
      const rawCart = sessionStorage.getItem(cartKey)
      let cartData: { items: CartItem[] } = { items: [] }

      if (rawCart) {
        try {
          const parsed = JSON.parse(rawCart)
          cartData = parsed.items
            ? parsed
            : { items: Array.isArray(parsed) ? parsed : [] }
        } catch {
          cartData = { items: [] }
        }
      }

      const existingIndex = cartData.items.findIndex(
        (item) =>
          (item.productId || item.productID) === product._id &&
          item.sku === selectedSku.sku,
      )

      if (existingIndex >= 0) {
        const nextQty = cartData.items[existingIndex].quantity + quantity
        cartData.items[existingIndex].quantity = Math.min(
          selectedSku.stockQuantity,
          nextQty,
        )
      } else {
        cartData.items.push({
          productId: product._id,
          productID: product._id,
          sku: selectedSku.sku,
          quantity,
          productName: product.name,
          image: product.images?.[0] || '/images/default-product.png',
          skuPrice: getSkuDisplayPrice(selectedSku),
          basePrice: product.basePrice,
          attributes: selectedSku.attributes,
          stockQuantity: selectedSku.stockQuantity,
        })
      }

      sessionStorage.setItem(cartKey, JSON.stringify(cartData))
      setItems(cartData.items)
      window.dispatchEvent(
        new CustomEvent('cart:updated', {
          detail: {
            productId: product._id,
            sku: selectedSku.sku,
            quantity,
          },
        }),
      )
      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`, {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      })
      onClose()
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng')
    }
  }

  const handleSubmitReview = async () => {
    const trimmedComment = reviewComment.trim()

    if (!productId) return
    if (!trimmedComment) {
      toast.error('Vui lòng nhập nội dung đánh giá')
      return
    }

    if (trimmedComment.length < 10) {
      toast.error('Vui lòng nhập ít nhất 10 ký tự cho nội dung đánh giá')
      return
    }

    setReviewSubmitting(true)
    try {
      await reviewService.createReview(
        { productId },
        {
          rating: reviewRating,
          comment: trimmedComment,
        },
      )

      toast.success('Gửi đánh giá thành công')
      setReviewComment('')
      setReviewRating(5)
      await fetchReviews()
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Bạn cần đăng nhập và mua sản phẩm trước khi đánh giá'
      toast.error(message)
    } finally {
      setReviewSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="flex h-[400px] items-center justify-center border-none bg-white/80 p-0 backdrop-blur-xl sm:rounded-[2.5rem]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
              <Loader2 className="h-6 w-6 animate-pulse text-blue-600" />
            </div>
            <p className="font-display text-lg font-bold text-slate-900">
              Đang chuẩn bị sản phẩm...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[95vh] overflow-hidden border-none bg-white p-0 shadow-2xl transition-all duration-500 sm:max-w-5xl sm:rounded-[2.5rem] lg:max-w-6xl xl:max-w-[1280px]">
        <div className="relative flex h-full flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
          {/* Close Button Mobile */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 rounded-full bg-white/80 p-2 text-slate-900 shadow-sm backdrop-blur-md transition-all hover:scale-110 hover:bg-white active:scale-95 lg:hidden"
          >
            <X size={20} />
          </button>

          {/* LEFT: GALLERY SECTION */}
          <ImageGallery
            images={product.images}
            productName={product.name}
            activeImageIndex={activeImageIndex}
            onImageChange={setActiveImageIndex}
          />

          {/* RIGHT: CONTENT SECTION */}
          <div className="relative flex flex-1 flex-col lg:h-[650px] xl:h-[750px]">
            {/* PRODUCT HEADER */}
            <ProductHeader
              name={product.name}
              categoryName={product.category?.name}
              avgRating={product.avgRating || 0}
              totalReviews={reviews.length}
              displayPrice={getSkuDisplayPrice(selectedSku)}
              stockQuantity={selectedSku?.stockQuantity || 0}
            />

            {/* TABS SECTION */}
            <div className="flex gap-10 border-b border-slate-100 px-10">
              {['info', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as 'info' | 'reviews')}
                  className={cn(
                    'relative py-4 text-[11px] font-black tracking-widest uppercase transition-all',
                    activeTab === tab
                      ? 'text-slate-900'
                      : 'text-slate-400 hover:text-slate-600',
                  )}
                >
                  {tab === 'info'
                    ? 'Thông tin sản phẩm'
                    : `Đánh giá (${reviews.length})`}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 h-0.5 w-full bg-slate-900" />
                  )}
                </button>
              ))}
            </div>

            {/* SCROLLABLE BODY */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 sm:p-10">
                {activeTab === 'info' ? (
                  <ProductInfoTab
                    inventory={product.inventory}
                    selectedSku={selectedSku}
                    setSelectedSku={setSelectedSku}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    attributes={product.attributes}
                  />
                ) : (
                  <ProductReviewsTab
                    avgRating={product.avgRating || 0}
                    reviews={reviews}
                    reviewsLoading={reviewsLoading}
                    reviewRating={reviewRating}
                    setReviewRating={setReviewRating}
                    reviewComment={reviewComment}
                    setReviewComment={setReviewComment}
                    reviewSubmitting={reviewSubmitting}
                    onSubmitReview={handleSubmitReview}
                    formatReviewDate={formatReviewDate}
                  />
                )}
              </div>
            </div>

            {/* STICKY ACTIONS */}
            <div className="sticky bottom-0 z-20 border-t border-slate-100 bg-white/80 p-6 backdrop-blur-3xl sm:px-10 dark:border-white/5 dark:bg-slate-900/80">
              <Button
                size="lg"
                className="group relative h-16 w-full overflow-hidden rounded-full bg-slate-900 text-sm font-black tracking-[0.2em] text-white uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 dark:bg-white dark:text-slate-900 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
                disabled={!selectedSku || selectedSku.stockQuantity <= 0}
                onClick={handleAddToCart}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <ShoppingCart className="h-5 w-5" strokeWidth={2.5} />
                  {selectedSku && selectedSku.stockQuantity > 0
                    ? `Thêm ${quantity} sản phẩm vào giỏ`
                    : 'Đã hết hàng'}
                </span>
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-blue-600 to-cyan-500 transition-transform duration-500 group-hover:translate-x-0" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, ShoppingCart, ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

import { productService } from '@/services/product.service'
import reviewService from '@/services/review.service'
import { ProductDetail, Inventory, Review } from '@/types'
import { cn } from '@/lib/utils'
import { useCart } from '@/features/cart/hooks/useCart'

import PageBackground from '@/components/layout/PageBackground'
import { ImageGallery } from './ImageGallery'
import { ProductHeader } from './ProductHeader'
import { ProductInfoTab } from './ProductInfoTab'
import { ProductReviewsTab } from './ProductReviewsTab'
import { RelatedProducts } from './RelatedProducts'

interface ProductDetailPageProps {
  productId: string
}

export const ProductDetailPage = ({ productId }: ProductDetailPageProps) => {
  const { addItem } = useCart()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedSku, setSelectedSku] = useState<Inventory | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
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

  useEffect(() => {
    if (!productId) {
      setProduct(null)
      setSelectedSku(null)
      setQuantity(1)
      setActiveImageIndex(0)
      setReviews([])
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
      } finally {
        setLoading(false)
        setReviewsLoading(false)
      }
    }

    fetchDetail()
  }, [productId])

  useEffect(() => setQuantity(1), [selectedSku])

  useEffect(() => {
    if (!selectedSku) return
    setQuantity((prev) =>
      Math.min(Math.max(prev, 1), selectedSku.stockQuantity || 1),
    )
  }, [selectedSku])

  return (
    <PageBackground>
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500">
          <Link
            href="/products"
            className="flex items-center gap-1.5 font-medium transition-colors hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Tất cả sản phẩm
          </Link>
          {product?.category && (
            <>
              <span className="text-slate-300">/</span>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="font-medium transition-colors hover:text-slate-900"
              >
                {product.category.name}
              </Link>
            </>
          )}
          {product && (
            <>
              <span className="text-slate-300">/</span>
              <span className="max-w-[200px] truncate font-medium text-slate-900">
                {product.name}
              </span>
            </>
          )}
        </nav>

        {/* Loading state */}
        {loading && (
          <div className="flex min-h-[500px] flex-col items-center justify-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
              <Loader2 className="h-6 w-6 animate-pulse text-blue-600" />
            </div>
            <p className="font-display text-lg font-bold text-slate-900">
              Đang chuẩn bị sản phẩm...
            </p>
          </div>
        )}

        {/* Product detail */}
        {!loading && product && (
          <>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:gap-16">
              {/* LEFT: Gallery (sticky on desktop) */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <div className="overflow-hidden rounded-3xl shadow-xl">
                  <ImageGallery
                    images={product.images}
                    productName={product.name}
                    activeImageIndex={activeImageIndex}
                    onImageChange={setActiveImageIndex}
                  />
                </div>
              </div>

              {/* RIGHT: Product info */}
              <div className="flex flex-col gap-8">
                <ProductHeader
                  name={product.name}
                  categoryName={product.category?.name}
                  avgRating={product.avgRating || 0}
                  totalReviews={reviews.length}
                  displayPrice={getSkuDisplayPrice(selectedSku)}
                  stockQuantity={selectedSku?.stockQuantity || 0}
                />

                {/* Tabs */}
                <div className="rounded-3xl border border-slate-100 bg-white/60 backdrop-blur-sm">
                  <div className="flex gap-8 border-b border-slate-100 px-8">
                    {(['info', 'reviews'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
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

                  <div className="p-8">
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
                        formatReviewDate={formatReviewDate}
                      />
                    )}
                  </div>
                </div>

                {/* Add to cart */}
                <Button
                  size="lg"
                  className="btn-premium-primary group relative h-16 w-full overflow-hidden shadow-xl"
                  disabled={!selectedSku || selectedSku.stockQuantity <= 0}
                  onClick={() => {
                    if (!product || !selectedSku) return
                    if ((selectedSku.stockQuantity ?? 0) <= 0) {
                      toast.error('Phiên bản đã chọn hiện đang hết hàng')
                      return
                    }
                    addItem(
                      {
                        productId: product._id,
                        sku: selectedSku.sku,
                        productName: product.name,
                        image: product.images?.[0] || '/images/default-product.png',
                        skuPrice: getSkuDisplayPrice(selectedSku),
                        basePrice: product.basePrice,
                        stockQuantity: selectedSku.stockQuantity ?? 0,
                        attributes: selectedSku.attributes,
                      },
                      quantity,
                    )
                  }}
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

            {/* Related products */}
            {product.category?.slug && (
              <RelatedProducts
                categorySlug={product.category.slug}
                currentProductId={productId}
              />
            )}
          </>
        )}
      </div>
    </PageBackground>
  )
}

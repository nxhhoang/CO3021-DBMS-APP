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
import { Loader2, ShoppingCart, Star, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

import { productService } from '@/services/product.service'
import { ProductDetail, Inventory } from '@/types'
import formatVND from '@/features/cart/utils/formatVND'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { CartItem } from '@/types/cart.types'

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
  const setCartItems = useCartStore((state) => state.setItems)
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedSku, setSelectedSku] = useState<Inventory | null>(null)
  const [quantity, setQuantity] = useState(1)

  const getSkuDisplayPrice = (item: Inventory | null) => {
    return item?.skuPrice ?? item?.sku_price ?? product?.basePrice ?? 0
  }

  // Fetch product detail
  useEffect(() => {
    if (!isOpen || !productId) {
      setProduct(null)
      setSelectedSku(null)
      setQuantity(1)
      return
    }

    const fetchDetail = async () => {
      setLoading(true)
      try {
        const response = await productService.getProductDetail({
          productId,
        })
        if (response.data) {
          setProduct(response.data)
          const firstInStock = response.data.inventory?.find(
            (item) => item.stockQuantity > 0,
          )
          setSelectedSku(firstInStock ?? response.data.inventory?.[0] ?? null)
        }
      } catch (error) {
        console.error(error)
        toast.error('Không thể tải thông tin sản phẩm')
        onClose()
      } finally {
        setLoading(false)
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
      setCartItems(cartData.items)
      window.dispatchEvent(
        new CustomEvent('cart:updated', {
          detail: {
            productId: product._id,
            sku: selectedSku.sku,
            quantity,
          },
        }),
      )
      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`)
      onClose()
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng')
    }
  }

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="flex h-72 items-center justify-center">
          <DialogHeader>
            <DialogTitle className="text-2xl leading-tight font-bold">
              Đang tải thông tin sản phẩm
            </DialogTitle>
          </DialogHeader>
          <Loader2 className="text-primary h-10 w-10 animate-spin" />
        </DialogContent>
      </Dialog>
    )
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-full sm:max-w-2xl lg:max-w-5xl xl:max-w-[80%]">
        <DialogHeader>
          <DialogTitle className="text-2xl leading-tight font-bold">
            {product.name}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-8 p-4 md:grid-cols-2">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="bg-muted relative aspect-square w-full overflow-hidden rounded-xl border">
              <Image
                src={product.images?.[0] || '/images/default-product.png'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images?.map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border"
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <Badge variant="secondary" className="text-primary">
                {product.category?.name || 'Sản phẩm'}
              </Badge>

              <DialogHeader className="p-0">
                <DialogTitle className="text-2xl leading-tight font-bold">
                  {product.name}
                </DialogTitle>
              </DialogHeader>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {product.avgRating || 5}
                  </span>
                  <span className="text-muted-foreground">
                    ({product.totalReviews || 0} đánh giá)
                  </span>
                </div>
                <span>•</span>
                <span className="text-muted-foreground">
                  Đã bán {product.totalSold || 0}
                </span>
              </div>
            </div>

            <div className="text-primary text-3xl font-black">
              {formatVND(getSkuDisplayPrice(selectedSku))}
            </div>

            {/* SKU & Quantity */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-muted-foreground text-sm font-bold tracking-wider uppercase">
                  Phiên bản
                </h4>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-3">
                    {product.inventory?.map((item) => {
                      const isSelected = selectedSku?.sku === item.sku
                      const isOutOfStock = item.stockQuantity <= 0

                      return (
                        <Button
                          key={item.sku}
                          variant={isSelected ? 'default' : 'outline'}
                          onClick={() => setSelectedSku(item)}
                          disabled={isOutOfStock}
                          className={cn(
                            'h-auto flex-col items-start gap-1.5 p-4 transition-all',
                            isSelected
                              ? 'border-primary ring-primary/20 ring-2'
                              : 'hover:border-primary/50',
                            isOutOfStock && 'opacity-50 grayscale',
                          )}
                        >
                          {/* Hiển thị SKU đã được format */}
                          <span className="text-sm font-bold uppercase">
                            {item.sku.split('-').join(' • ')}
                          </span>
                        </Button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {selectedSku?.attributes &&
                Object.keys(selectedSku.attributes).length > 0 && (
                  <div className="space-y-2 rounded-lg border p-3">
                    <h4 className="text-muted-foreground text-sm font-semibold">
                      Thông số phiên bản đã chọn
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(selectedSku.attributes).map(
                        ([key, value]) => (
                          <Badge
                            key={key}
                            variant="outline"
                            className="font-medium"
                          >
                            {key}: {String(value)}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                )}

              <div className="space-y-2">
                <h4 className="text-muted-foreground text-sm font-bold tracking-wider uppercase">
                  Số lượng
                </h4>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 items-center overflow-hidden rounded-lg border">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-full rounded-none"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-bold">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-full rounded-none"
                      onClick={() =>
                        setQuantity(
                          Math.min(
                            selectedSku?.stockQuantity || 1,
                            quantity + 1,
                          ),
                        )
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {selectedSku?.stockQuantity || 0} sản phẩm có sẵn
                  </span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="mt-auto border-t pt-6">
              <Button
                size="lg"
                className="h-12 w-full flex-1 gap-2 font-bold"
                disabled={!selectedSku || selectedSku.stockQuantity <= 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {selectedSku && selectedSku.stockQuantity > 0
                  ? 'THÊM VÀO GIỎ'
                  : 'HẾT HÀNG'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

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
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedSku, setSelectedSku] = useState<Omit<
    Inventory,
    'productID'
  > | null>(null)
  const [quantity, setQuantity] = useState(1)

  // Fetch product detail
  useEffect(() => {
    if (!isOpen || !productId) return

    const fetchDetail = async () => {
      setLoading(true)
      try {
        const response = await productService.getProductDetail({
          id: productId,
        })
        if (response.data) {
          setProduct(response.data)
          if (response.data.inventory?.length) {
            setSelectedSku(response.data.inventory[0])
          }
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

  // Add to cart
  const handleAddToCart = () => {
    if (!product || !selectedSku) return

    try {
      const cartKey = 'cart'
      const rawCart = sessionStorage.getItem(cartKey)
      let cartData: { items: any[] } = { items: [] }

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
          item.productID === product._id && item.sku === selectedSku.sku,
      )

      if (existingIndex >= 0) {
        cartData.items[existingIndex].quantity += quantity
      } else {
        cartData.items.push({
          productID: product._id,
          sku: selectedSku.sku,
          quantity,
          productName: product.name,
          image: product.images?.[0] || '/images/default-product.png',
          skuPrice: selectedSku.skuPrice,
          basePrice: product.basePrice,
          attributes: selectedSku.attributes,
          stockQuantity: selectedSku.stockQuantity,
        })
      }

      sessionStorage.setItem(cartKey, JSON.stringify(cartData))
      window.dispatchEvent(new Event('storage'))
      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`)
      onClose()
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng')
    }
  }

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="flex h-72 items-center justify-center">
          <Loader2 className="text-primary h-10 w-10 animate-spin" />
        </DialogContent>
      </Dialog>
    )
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] max-w-4xl overflow-y-auto p-0 sm:p-6">
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
              <Badge variant="outline" className="text-primary border-primary">
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
                <div className="bg-border h-4 w-px" />
                <span className="text-muted-foreground">
                  Đã bán {product.totalSold || 0}
                </span>
              </div>
            </div>

            <div className="text-primary text-3xl font-black">
              {formatVND(selectedSku?.skuPrice || product.basePrice)}
            </div>

            {/* SKU & Quantity */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-muted-foreground text-sm font-bold tracking-wider uppercase">
                  Phiên bản
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.inventory?.map((item) => (
                    <Button
                      key={item.sku}
                      variant={
                        selectedSku?.sku === item.sku ? 'default' : 'outline'
                      }
                      onClick={() => setSelectedSku(item)}
                      disabled={item.stockQuantity <= 0}
                      className="h-auto min-w-25 flex-col items-start gap-1 p-3"
                    >
                      <span className="text-sm font-bold">{item.sku}</span>
                      <span className="text-[10px] opacity-70">
                        Kho: {item.stockQuantity}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

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
                className="h-12 flex-1 gap-2 font-bold"
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

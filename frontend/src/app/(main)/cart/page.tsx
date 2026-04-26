'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { ItemsList, OrderSummary, useCart } from '@/features/cart'
import PageBackground from '@/components/layout/PageBackground'

export default function CartPage() {
  const {
    items,
    selectedItems,
    selectedSkus,
    toggleItemSelection,
    toggleAllSelection,
    loading,
    updateQuantity,
    removeItem,
    totalPrice,
    removeMultipleItems,
    loadCartWithDetails,
  } = useCart()

  useEffect(() => {
    loadCartWithDetails()
  }, [loadCartWithDetails])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="text-primary h-12 w-12 animate-spin stroke-[1.5]" />
        <div className="space-y-2 text-center">
          <p className="font-display text-xl font-bold tracking-tight">
            Đang chuẩn bị giỏ hàng
          </p>
          <p className="text-muted-foreground animate-pulse text-sm">
            Vui lòng đợi trong giây lát...
          </p>
        </div>
      </div>
    )
  }

  return (
    <PageBackground variant="subtle" className="overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="animate-in fade-in slide-in-from-top-4 mb-8 flex items-baseline gap-3 duration-500">
          <h1 className="font-display text-4xl font-black tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Giỏ hàng
          </h1>
          <div className="font-mono text-lg font-medium text-slate-400">
            / {totalItems} items
          </div>
        </div>

        {items.length === 0 ? (
          <div className="glass-card animate-in fade-in zoom-in-95 relative flex flex-col items-center justify-center py-32 duration-700">
            <div className="relative mb-10">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <ShoppingBag
                  className="h-14 w-14 text-slate-300"
                  strokeWidth={1.5}
                />
              </div>
              <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/5" />
            </div>

            <div className="max-w-md space-y-4 text-center">
              <h2 className="font-display text-3xl font-black text-slate-900 dark:text-white">
                Chưa có gì ở đây cả
              </h2>
              <p className="text-base leading-relaxed font-medium text-slate-500">
                Giỏ hàng của bạn đang mong chờ những sản phẩm công nghệ tuyệt
                vời. Hãy bắt đầu hành trình mua sắm ngay!
              </p>
            </div>

            <Button
              asChild
              size="lg"
              className="btn-premium-primary font-display mt-12 h-16 px-12 text-[11px] font-black tracking-[0.2em] uppercase transition-all hover:scale-[1.05]"
            >
              <Link href="/products">Khám phá sản phẩm</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <ItemsList
                items={items}
                selectedSkus={selectedSkus}
                toggleItemSelection={toggleItemSelection}
                toggleAllSelection={toggleAllSelection}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
                removeMultipleItems={removeMultipleItems}
              />
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <OrderSummary
                  selectedItems={selectedItems}
                  totalPrice={totalPrice}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </PageBackground>
  )
}

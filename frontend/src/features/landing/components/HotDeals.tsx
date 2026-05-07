'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { ProductCard, useProducts } from '@/features/products'
import { ProductResponse } from '@/types/product.types'
import { SORT_BY } from '@/constants/enum'
import { cn } from '@/lib/utils'


export function HotDeals() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [showScrollbar, setShowScrollbar] = useState(false)

  // Just pick some products as "Hot Deals"
  const hotProducts = useProducts({
    sort: SORT_BY.SOLD_DESC,
    limit: 10,
  }).products

  const productsToDisplay = [...hotProducts, ...hotProducts]

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number

    const scroll = () => {
      if (isPaused) return

      // Smooth increment
      scrollContainer.scrollLeft += 0.8 // Slightly faster for infinite loop feel
      
      // Seamless jump: if we've scrolled past the first half (the original set)
      // we jump back to the start. The user won't notice because the items are identical.
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0
      }
      
      animationId = requestAnimationFrame(scroll)
    }

    if (!isPaused) {
      animationId = requestAnimationFrame(scroll)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [isPaused])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      // Lock vertical scroll and only allow horizontal
      if (e.deltaY !== 0) {
        e.preventDefault()
        container.scrollLeft += e.deltaY
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (
    <section className="section-padding container mx-auto max-w-7xl px-4">
      {/* Section: Hot Deals */}
      <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
          <span className="glass-badge-red">Đừng bỏ lỡ</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Ưu đãi{' '}
            <span className="bg-linear-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              Hấp dẫn nhất
            </span>
          </h2>
        </div>
        <Link
          href="/products"
          className="group flex items-center gap-2 text-sm font-bold text-slate-900 transition-colors hover:text-blue-600"
        >
          Xem tất cả deal
          <ChevronRight
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          onMouseEnter={() => {
            setIsPaused(true)
            setShowScrollbar(true)
          }}
          onMouseLeave={() => {
            setIsPaused(false)
            setShowScrollbar(false)
          }}
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            scrollbarWidth: showScrollbar ? 'thin' : 'none',
            msOverflowStyle: showScrollbar ? 'auto' : 'none',
          }}
          className={cn(
            'scrollbar-hide animate-in fade-in slide-in-from-bottom-12 flex gap-5 overflow-x-auto pb-8 delay-300 duration-1000',
            showScrollbar && 'scrollbar-default',
          )}
        >
          {productsToDisplay.map((product, index) => (
            <ProductCard
              key={`${product._id}-${index}`}
              product={product as unknown as ProductResponse}
              showDiscount={true}
              discountPercent={20}
              className="min-w-[220px] md:min-w-[260px]"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

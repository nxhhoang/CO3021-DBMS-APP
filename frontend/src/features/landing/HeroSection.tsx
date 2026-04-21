'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const HERO_SPEED_OPTIONS = [
  { label: 'Nhanh', duration: 3000 },
  { label: 'Vừa', duration: 4500 },
  { label: 'Chậm', duration: 6500 },
]

const heroSlides = [
  {
    src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200',
    alt: 'Hero Product Watch',
  },
  {
    src: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=1200',
    alt: 'Hero Product Laptop',
  },
  {
    src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1200',
    alt: 'Hero Product Smartphone',
  },
  {
    src: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&q=80&w=1200',
    alt: 'Hero Product Tablet',
  },
  {
    src: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&q=80&w=1200',
    alt: 'Hero Product Accessories',
  },
]

export default function HeroSection() {
  const router = useRouter()
  const [activeHeroSlide, setActiveHeroSlide] = useState(0)
  const [heroProgress, setHeroProgress] = useState(0)
  const [heroSlideDuration, setHeroSlideDuration] = useState(
    HERO_SPEED_OPTIONS[1].duration,
  )
  const [isHeroPaused, setIsHeroPaused] = useState(false)
  const elapsedRef = useRef(0)
  const lastTimestampRef = useRef<number | null>(null)

  const goToHeroSlide = (slideIndex: number) => {
    setActiveHeroSlide(slideIndex)
    elapsedRef.current = 0
    setHeroProgress(0)
  }

  const goToPrevHeroSlide = () => {
    setActiveHeroSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    )
    elapsedRef.current = 0
    setHeroProgress(0)
  }

  const goToNextHeroSlide = () => {
    setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length)
    elapsedRef.current = 0
    setHeroProgress(0)
  }

  const handleExploreProducts = () => {
    router.push('/products')
  }

  const handleViewAllCategories = () => {
    const targetId = 'featured-categories'
    const section = document.getElementById(targetId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    router.push(`/#${targetId}`)
  }

  useEffect(() => {
    let frameId = 0
    const tick = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp
      }
      const delta = timestamp - lastTimestampRef.current
      lastTimestampRef.current = timestamp

      if (!isHeroPaused) {
        elapsedRef.current += delta
        if (elapsedRef.current >= heroSlideDuration) {
          const slideAdvance = Math.floor(
            elapsedRef.current / heroSlideDuration,
          )
          setActiveHeroSlide(
            (prev) => (prev + slideAdvance) % heroSlides.length,
          )
          elapsedRef.current %= heroSlideDuration
        }
        const nextProgress = Math.min(
          (elapsedRef.current / heroSlideDuration) * 100,
          100,
        )
        setHeroProgress(nextProgress)
      }
      frameId = window.requestAnimationFrame(tick)
    }
    frameId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frameId)
  }, [heroSlideDuration, isHeroPaused])

  return (
    <section className="relative container mx-auto px-4 py-8 sm:py-12 lg:py-20">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-neutral-50/10 shadow-2xl ring-1 ring-black/5 backdrop-blur-3xl transition-all duration-500 ease-in-out hover:shadow-blue-900/5 lg:flex lg:items-stretch">
        <div className="relative z-10 border-b border-white/20 bg-linear-to-br from-white/10 via-white/5 to-transparent px-6 py-8 sm:px-8 sm:py-10 lg:flex lg:w-1/2 lg:items-center lg:border-r lg:border-b-0 lg:px-10 lg:py-12 xl:px-12">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-28 left-14 h-64 w-64 rounded-full bg-blue-100/40 blur-3xl" />
            <div className="absolute top-1/2 -right-10 h-48 w-48 rounded-full bg-cyan-100/30 blur-3xl" />
          </div>

          <div className="relative">
            <span className="inline-block w-fit rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-[11px] font-semibold tracking-wide text-blue-600 backdrop-blur-sm">
              Danh mục nổi bật
            </span>

            <h1 className="mt-5 font-display text-4xl leading-[1.1] font-bold tracking-tight text-slate-900 sm:text-5xl lg:mt-6 lg:text-6xl xl:text-[3.8rem]">
              Nâng tầm phong cách <br />
              <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Sống hiện đại
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base lg:mt-6 lg:text-lg lg:leading-8">
              Từ công nghệ đột phá đến thời trang đẳng cấp — Khám phá hệ sinh thái sản phẩm cao cấp được tuyển chọn dành riêng cho bạn.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 lg:mt-10">
              <Button
                onClick={handleExploreProducts}
                className="group relative h-12 overflow-hidden rounded-full bg-slate-900 px-8 text-sm font-bold text-white transition-all duration-300 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-200/50 active:scale-95 sm:h-14 sm:px-10"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Khám phá ngay
                  <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 z-0 bg-linear-to-tr from-blue-600/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </Button>

              <Button
                variant="outline"
                onClick={handleViewAllCategories}
                className="h-12 rounded-full border-slate-200 bg-white/40 px-8 text-sm font-semibold text-slate-700 backdrop-blur-md transition-all duration-300 hover:border-slate-300 hover:bg-white/60 hover:text-slate-900 active:scale-95 sm:h-14 sm:px-10"
              >
                Xem các sản phẩm nổi bật
              </Button>
            </div>
          </div>
        </div>

        <div
          className="group/hero relative h-96 overflow-hidden bg-slate-200 sm:h-112 lg:h-auto lg:min-h-144 lg:w-1/2"
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
        >
          {heroSlides.map((slide, index) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
                index === activeHeroSlide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}

          <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-slate-900/10 via-transparent to-white/15" />

          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-36 bg-linear-to-r from-black/45 to-transparent opacity-0 transition-opacity duration-300 group-hover/hero:opacity-100" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-36 bg-linear-to-l from-black/45 to-transparent opacity-0 transition-opacity duration-300 group-hover/hero:opacity-100" />

          <button
            type="button"
            onClick={goToPrevHeroSlide}
            className="absolute top-1/2 left-4 z-30 -translate-y-1/2 rounded-full border border-white/35 bg-black/35 p-2 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover/hero:opacity-100 hover:bg-black/55"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={goToNextHeroSlide}
            className="absolute top-1/2 right-4 z-30 -translate-y-1/2 rounded-full border border-white/35 bg-black/35 p-2 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover/hero:opacity-100 hover:bg-black/55"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute right-6 bottom-6 left-6 z-30">
            <div className="flex gap-2">
              {heroSlides.map((slide, index) => {
                const width =
                  index < activeHeroSlide
                    ? '100%'
                    : index === activeHeroSlide
                      ? `${heroProgress}%`
                      : '0%'
                return (
                  <button
                    key={`${slide.alt}-${index}`}
                    type="button"
                    onClick={() => goToHeroSlide(index)}
                    className="group/progress relative flex-1 cursor-pointer touch-manipulation py-1 focus:outline-none"
                  >
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/30 transition-all duration-200 ease-out group-hover/progress:h-2 group-hover/progress:bg-white/45" />
                    <div
                      className="pointer-events-none absolute inset-y-1 left-0 rounded-full bg-white transition-[width] duration-100"
                      style={{ width }}
                    />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* QUICK CATEGORY NAV */}
      <div className="mt-12 flex flex-wrap justify-center gap-4 sm:mt-16 lg:gap-8">
        {[
          { label: 'Laptops', icon: '💻', href: '/products?category=laptop' },
          { label: 'Điện thoại', icon: '📱', href: '/products?category=dien-thoai' },
          { label: 'Đồng hồ', icon: '⌚', href: '/products?category=dong-ho' },
          { label: 'Giày dép', icon: '👟', href: '/products?category=giay' },
          { label: 'Máy ảnh', icon: '📷', href: '/products?category=camera' },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-2 rounded-full border border-slate-100 bg-white/60 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:bg-white hover:text-blue-600 hover:shadow-md active:scale-95"
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
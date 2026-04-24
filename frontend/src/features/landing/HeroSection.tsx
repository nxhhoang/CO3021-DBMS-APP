'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Laptop,
  Smartphone,
  Watch,
  Footprints,
  Camera,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

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
      <div className="glass-card overflow-hidden lg:flex lg:items-stretch">
        <div className="relative z-10 border-b border-white/20 bg-linear-to-br from-white/10 via-white/5 to-transparent px-6 py-8 sm:px-8 sm:py-10 lg:flex lg:w-1/2 lg:items-center lg:border-r lg:border-b-0 lg:px-10 lg:py-12 xl:px-12">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-28 left-14 h-64 w-64 rounded-full bg-blue-100/40 blur-3xl" />
            <div className="absolute top-1/2 -right-10 h-48 w-48 rounded-full bg-cyan-100/30 blur-3xl" />
          </div>

          <div className="relative animate-in fade-in slide-in-from-left-8 duration-1000">
            <span className="glass-badge-blue">Danh mục nổi bật</span>

            <h1 className="font-display mt-5 text-4xl leading-[1.1] font-bold tracking-tight text-slate-900 sm:text-5xl lg:mt-6 lg:text-6xl xl:text-[3.8rem] animate-in fade-in slide-in-from-left-12 duration-1000 delay-150">
              Nâng tầm phong cách <br />
              <span className="text-gradient-primary">Sống hiện đại</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base lg:mt-6 lg:text-lg lg:leading-8 animate-in fade-in slide-in-from-left-16 duration-1000 delay-300">
              Từ công nghệ đột phá đến thời trang đẳng cấp — Khám phá hệ sinh
              thái sản phẩm cao cấp được tuyển chọn dành riêng cho bạn.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 lg:mt-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
              <Button
                onClick={handleExploreProducts}
                className="btn-premium-primary group relative h-12 px-8 text-sm sm:h-14 sm:px-10"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Khám phá ngay
                  <ChevronRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
                <div className="absolute inset-0 z-0 bg-linear-to-tr from-blue-600/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </Button>

              <Button
                variant="outline"
                onClick={handleViewAllCategories}
                className="btn-premium-secondary h-12 px-8 text-sm sm:h-14 sm:px-10"
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
      <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-5">
        {[
          {
            label: 'Laptops',
            icon: Laptop,
            href: '/products?category=laptop',
            description: 'Đỉnh cao công nghệ',
          },
          {
            label: 'Điện thoại',
            icon: Smartphone,
            href: '/products?category=dien-thoai',
            description: 'Kết nối tương lai',
          },
          {
            label: 'Đồng hồ',
            icon: Watch,
            href: '/products?category=dong-ho',
            description: 'Sang trọng & Đẳng cấp',
          },
          {
            label: 'Giày dép',
            icon: Footprints,
            href: '/products?category=giay',
            description: 'Năng động mỗi ngày',
          },
          {
            label: 'Máy ảnh',
            icon: Camera,
            href: '/products?category=camera',
            description: 'Lưu giữ khoảnh khắc',
          },
        ].map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "group flex flex-col items-center text-center transition-transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8 duration-700",
              index === 0 && "delay-100",
              index === 1 && "delay-200",
              index === 2 && "delay-300",
              index === 3 && "delay-400",
              index === 4 && "delay-500"
            )}
          >
            <div className="icon-box-premium mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-600 shadow-sm transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-blue-500/20 group-hover:border-transparent">
              <item.icon size={28} strokeWidth={2} className="transition-transform group-hover:scale-110" />
            </div>
            <h3 className="text-[13px] font-bold text-slate-800 transition-colors group-hover:text-blue-600">
              {item.label}
            </h3>
            <p className="mt-1.5 text-[10px] font-medium text-slate-500 opacity-0 transition-all duration-300 group-hover:translate-y-0 translate-y-2 group-hover:opacity-100">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
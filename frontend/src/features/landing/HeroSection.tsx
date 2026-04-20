'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
    src: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1200',
    alt: 'Hero Product Laptop',
  },
  {
    src: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=1200',
    alt: 'Hero Product Smartphone',
  },
  {
    src: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=1200',
    alt: 'Hero Product Tablet',
  },
  {
    src: 'https://images.unsplash.com/photo-1622286346003-c5c7e63b1088?auto=format&fit=crop&q=80&w=1200',
    alt: 'Hero Product Accessories',
  },
]

export default function HeroSection() {
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

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [heroSlideDuration, isHeroPaused])

  useEffect(() => {
    elapsedRef.current = 0
    setHeroProgress(0)
  }, [heroSlideDuration])

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#f8f9fa] lg:flex lg:items-center">
        <div className="z-10 p-8 md:p-16 lg:w-1/2">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">
            Edition 2026
          </span>
          <h1 className="mt-4 text-5xl leading-tight font-black tracking-tighter italic md:text-7xl">
            FUTURE <br />
            <span className="text-blue-500 underline decoration-blue-200 underline-offset-4">
              DIGITAL.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-slate-500">
            Khám phá bộ sưu tập công nghệ được tuyển chọn, nơi sự chính xác kiến
            trúc kết hợp với sự sang trọng hiện đại.
          </p>
          <div className="mt-8 flex gap-4">
            <Button className="rounded-full bg-blue-600 px-8 py-6 hover:bg-blue-700">
              MUA NGAY
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-slate-200 px-8 py-6"
            >
              XEM THÊM
            </Button>
          </div>
        </div>
        <div
          className="group/hero relative h-100 overflow-hidden bg-slate-200 lg:h-150 lg:w-1/2"
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
        >
          {heroSlides.map((slide, index) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              onError={(event) => {
                if (event.currentTarget.src !== heroSlides[0].src) {
                  event.currentTarget.src = heroSlides[0].src
                  return
                }
                event.currentTarget.onerror = null
              }}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
                index === activeHeroSlide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}

          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-36 bg-linear-to-r from-black/45 to-transparent opacity-0 transition-opacity duration-300 group-hover/hero:opacity-100" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-36 bg-linear-to-l from-black/45 to-transparent opacity-0 transition-opacity duration-300 group-hover/hero:opacity-100" />

          <button
            type="button"
            aria-label="Ảnh trước"
            onClick={goToPrevHeroSlide}
            className="absolute top-1/2 left-4 z-30 -translate-y-1/2 rounded-full border border-white/35 bg-black/35 p-2 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover/hero:opacity-100 hover:bg-black/55"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            aria-label="Ảnh tiếp theo"
            onClick={goToNextHeroSlide}
            className="absolute top-1/2 right-4 z-30 -translate-y-1/2 rounded-full border border-white/35 bg-black/35 p-2 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover/hero:opacity-100 hover:bg-black/55"
          >
            <ChevronRight size={20} />
          </button>

          {/* <div className="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-full bg-black/35 p-1 backdrop-blur-sm">
						{HERO_SPEED_OPTIONS.map((speed) => (
							<button
								key={speed.label}
								type="button"
								onClick={() => setHeroSlideDuration(speed.duration)}
								className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase transition-colors ${
									heroSlideDuration === speed.duration
										? 'bg-white text-slate-900'
										: 'text-white/85 hover:bg-white/15'
								}`}
							>
								{speed.label}
							</button>
						))}
					</div> */}

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
                    aria-label={`Chuyển đến ảnh ${index + 1}`}
                    onClick={() => goToHeroSlide(index)}
                    className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/30"
                  >
                    <div
                      className="h-full rounded-full bg-white transition-[width] duration-100"
                      style={{ width }}
                    />
                  </button>
                )
              })}
            </div>

            {/* <p className="mt-2 text-center text-[10px] font-semibold tracking-widest text-white/90 uppercase">
							{isHeroPaused ? 'Tạm dừng khi rê chuột' : 'Tự động chuyển ảnh'}
						</p> */}
          </div>
        </div>
      </div>
    </section>
  )
}

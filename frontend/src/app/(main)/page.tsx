'use client'

import React from 'react'
import { Search } from 'lucide-react'
import HeroSection from '@/features/landing/HeroSection'
import CategoriesSection from '@/features/landing/CategoriesSection'
import PromoBanners from '@/features/landing/PromoBanners'
import FeaturedProducts from '@/features/landing/FeaturedProducts'
import BrandLogos from '@/features/landing/BrandLogos'
import HotDeals from '@/features/landing/HotDeals'

export default function LandingPage() {

  return (
    <div className="relative isolate min-h-screen w-full overflow-clip bg-white text-slate-900">
      {/* REUSABLE BACKGROUND SYSTEM */}
      <div className="mesh-gradient-container">
        <div className="mesh-gradient-base" />
        <div className="mesh-gradient-dots" />
        <div className="mesh-gradient-spotlight" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="mesh-gradient-blob -top-[5%] left-[15%] h-[600px] w-[600px] bg-blue-300/20 blur-[120px] animate-pulse" />
          <div className="mesh-gradient-blob top-[10%] right-[10%] h-[500px] w-[500px] bg-cyan-300/20 blur-[100px]" />
          <div className="mesh-gradient-blob top-[40%] left-[5%] h-[400px] w-[400px] bg-sky-200/20 blur-[90px]" />
          <div className="mesh-gradient-blob top-[20%] left-[40%] h-[300px] w-[300px] bg-blue-400/10 blur-[80px]" />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_100%)] opacity-20" />
      </div>

      <div className="relative z-10">
        <HeroSection />

        {/* HOT DEALS */}
        <HotDeals />

        {/* CATEGORIES GRID */}
        <CategoriesSection />

        {/* PROMO BANNERS */}
        <PromoBanners />

        {/* FEATURED PRODUCTS */}
        <FeaturedProducts />

        {/* BRAND LOGOS */}
        <BrandLogos />
      </div>
    </div>
  )
}
'use client'

import React from 'react'
import { Search } from 'lucide-react'
import HeroSection from '@/features/landing/HeroSection'
import CategoriesSection from '@/features/landing/CategoriesSection'
import TrustSignals from '@/features/landing/TrustSignals'
import HotDeals from '@/features/landing/HotDeals'
import PromoBanners from '@/features/landing/PromoBanners'
import FeaturedProducts from '@/features/landing/FeaturedProducts'
import BrandLogos from '@/features/landing/BrandLogos'
import Newsletter from '@/features/landing/Newsletter'

export default function LandingPage() {

  return (
    <div className="relative isolate min-h-screen w-full overflow-clip bg-white text-slate-900">
      {/* IMPROVED BACKGROUND SYSTEM */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Base Layer Gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-50 via-white to-slate-100" />

        {/* Sophisticated Dot Pattern */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle, #64748b 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Spotlight behind Hero */}
        <div className="absolute top-0 left-1/2 h-[800px] w-full -translate-x-1/2 bg-[radial-gradient(circle_at_50%_40%,rgba(147,197,253,0.15),transparent_70%)]" />

        {/* Vivid Mesh Gradient Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[5%] left-[15%] h-[600px] w-[600px] rounded-full bg-blue-300/20 blur-[120px] animate-pulse" />
          <div className="absolute top-[10%] right-[10%] h-[500px] w-[500px] rounded-full bg-cyan-300/20 blur-[100px]" />
          <div className="absolute top-[40%] left-[5%] h-[400px] w-[400px] rounded-full bg-sky-200/20 blur-[90px]" />
          <div className="absolute top-[20%] left-[40%] h-[300px] w-[300px] rounded-full bg-blue-400/10 blur-[80px]" />
        </div>

        {/* Subtle Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_100%)] opacity-20" />
      </div>

      <div className="relative z-10">
        <HeroSection />
        
        {/* TRUST SIGNALS */}
        <TrustSignals />

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

        {/* NEWSLETTER */}
        <Newsletter />
      </div>
    </div>
  )
}
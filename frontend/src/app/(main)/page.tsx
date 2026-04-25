'use client'

import HeroSection from '@/features/landing/HeroSection'
import CategoriesSection from '@/features/landing/CategoriesSection'
import PromoBanners from '@/features/landing/PromoBanners'
import FeaturedProducts from '@/features/landing/FeaturedProducts'
import BrandLogos from '@/features/landing/BrandLogos'
import HotDeals from '@/features/landing/HotDeals'
import PageBackground from '@/components/layout/PageBackground'

export default function LandingPage() {
  return (
    <PageBackground>
      <HeroSection />
      <HotDeals />
      <CategoriesSection />
      <PromoBanners />
      <FeaturedProducts />
      <BrandLogos />
    </PageBackground>
  )
}

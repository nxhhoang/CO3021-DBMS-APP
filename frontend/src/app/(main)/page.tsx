'use client'

import {
  HeroSection,
  CategoriesSection,
  PromoBanners,
  FeaturedProducts,
  BrandLogos,
  HotDeals,
} from '@/features/landing'

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

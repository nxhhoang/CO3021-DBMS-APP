'use client'

import React from 'react'

const BRANDS = [
  {
    name: 'Apple',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  },
  {
    name: 'Samsung',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Samsung_wordmark.svg',
  },
  {
    name: 'Sony',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg',
  },
  {
    name: 'Nike',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
  },
  {
    name: 'Adidas',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
  },
  {
    name: 'Microsoft',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
  },
]

export function BrandLogos() {
  return (
    <section className="container mx-auto border-t border-slate-50 px-4 py-20">
      <div className="mb-12 text-center">
        <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
          Thương hiệu đồng hành
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale transition-all md:gap-20">
        {BRANDS.map((brand) => (
          <img
            key={brand.name}
            src={brand.logo}
            alt={brand.name}
            className="h-8 w-auto object-contain transition-all hover:opacity-100 hover:grayscale-0"
          />
        ))}
      </div>
    </section>
  )
}

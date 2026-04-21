'use client'

import React from 'react'

const BRANDS = [
  { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
  { name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg' },
  { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
  { name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
  { name: 'Canon', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Canon_logo.svg' },
]

export default function BrandLogos() {
  return (
    <section className="container mx-auto px-4 py-20 border-t border-slate-50">
      <div className="mb-12 text-center">
        <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
          Thương hiệu đồng hành
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-12 grayscale opacity-40 transition-all md:gap-20">
        {BRANDS.map((brand) => (
          <img
            key={brand.name}
            src={brand.logo}
            alt={brand.name}
            className="h-8 w-auto transition-all hover:grayscale-0 hover:opacity-100"
          />
        ))}
      </div>
    </section>
  )
}

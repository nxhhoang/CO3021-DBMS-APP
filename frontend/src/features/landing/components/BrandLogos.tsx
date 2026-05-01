'use client'

import React from 'react'
import { motion } from 'framer-motion'


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
    <section className="container mx-auto max-w-7xl border-t border-slate-50 px-4 py-20">
      <div className="mb-12 text-center">
        <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
          Thương hiệu đồng hành
        </p>
      </div>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        className="flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale transition-all md:gap-20"
      >
        {BRANDS.map((brand) => (
          <motion.img
            key={brand.name}
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.8 },
              show: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            src={brand.logo}
            alt={brand.name}
            className="h-8 w-auto object-contain transition-all hover:opacity-100 hover:grayscale-0"
          />
        ))}
      </motion.div>
    </section>
  )
}

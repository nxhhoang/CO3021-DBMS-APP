'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  images?: string[]
  productName: string
  activeImageIndex: number
  onImageChange: (index: number) => void
}

export const ImageGallery = ({
  images,
  productName,
  activeImageIndex,
  onImageChange,
}: ImageGalleryProps) => {
  const displayImages = images?.length ? images : ['/images/default-product.png']

  return (
    <div className="relative w-full bg-slate-50 lg:w-[50%] lg:shrink-0">
      <div className="relative aspect-square w-full lg:aspect-auto lg:h-full">
        <Image
          src={displayImages[activeImageIndex]}
          alt={productName}
          fill
          className="object-cover transition-all duration-700"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {displayImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-white/10 p-1.5 backdrop-blur-xl">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onImageChange(idx)}
              className={cn(
                'relative h-12 w-12 overflow-hidden rounded-full border-2 transition-all duration-300 hover:scale-110',
                activeImageIndex === idx
                  ? 'border-blue-600 ring-2 ring-blue-600/20'
                  : 'border-transparent opacity-70 hover:opacity-100',
              )}
            >
              <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

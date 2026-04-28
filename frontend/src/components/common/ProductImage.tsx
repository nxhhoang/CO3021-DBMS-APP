'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

const DEFAULT_IMAGE = '/images/default-product.png'

type ProductImageProps = Omit<ImageProps, 'src'> & { src?: string | null }

export const ProductImage = ({
  src,
  alt,
  sizes,
  ...props
}: ProductImageProps) => {
  const [error, setError] = useState(false)
  const resolvedSizes = sizes ?? (props.fill ? '100vw' : undefined)

  // Reset error state when src changes
  const [prevSrc, setPrevSrc] = useState(src)
  if (src !== prevSrc) {
    setPrevSrc(src)
    setError(false)
  }

  return (
    <Image
      {...props}
      src={error || !src ? DEFAULT_IMAGE : src}
      alt={alt}
      sizes={resolvedSizes}
      onError={() => setError(true)}
    />
  )
}

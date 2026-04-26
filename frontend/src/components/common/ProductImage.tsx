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
  const [imgSrc, setImgSrc] = useState<string>(src || DEFAULT_IMAGE)

  const resolvedSizes = sizes ?? (props.fill ? '100vw' : undefined)

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      sizes={resolvedSizes}
      onError={() => setImgSrc(DEFAULT_IMAGE)}
    />
  )
}

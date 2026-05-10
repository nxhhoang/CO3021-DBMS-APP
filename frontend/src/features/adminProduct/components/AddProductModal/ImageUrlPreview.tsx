'use client'

import { useEffect, useRef, useState } from 'react'
import { Trash2, X, Link as LinkIcon, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/ui/field'

interface ImageUrlPreviewProps {
  images: string[]
  onChange: (newImages: string[]) => void
}

export default function ImageUrlPreview({
  images,
  onChange,
}: ImageUrlPreviewProps) {
  const [inputValue, setInputValue] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(
    images[0] || null,
  )
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const thumbnailsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      images.length > 0 &&
      (!selectedImage || !images.includes(selectedImage))
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedImage(images[images.length - 1])
    } else if (images.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedImage(null)
    }
  }, [images])

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const checkImageExists = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = url
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
    })
  }

  const addImage = async () => {
    const url = inputValue.trim()
    if (!url) return
    if (images.includes(url)) {
      setError('Ảnh đã tồn tại')
      return
    }
    if (!isValidUrl(url)) {
      setError('URL không hợp lệ')
      return
    }

    setChecking(true)
    const isImage = await checkImageExists(url)
    setChecking(false)

    if (!isImage) {
      setError('Không phải link ảnh hợp lệ')
      return
    }

    onChange([...images, url])
    setInputValue('')
    setError(null)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const clearAllImages = () => {
    onChange([])
    setSelectedImage(null)
    setError(null)
  }

  const handleThumbnailWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!thumbnailsRef.current) return

    const delta =
      Math.abs(event.deltaY) >= Math.abs(event.deltaX)
        ? event.deltaY
        : event.deltaX

    if (delta === 0) return

    thumbnailsRef.current.scrollLeft += delta
    event.preventDefault()
  }

  return (
    <div className="flex h-[550px] w-full min-w-0 flex-col gap-5 overflow-hidden">
      {/* 2. Preview Area */}
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-slate-50 shadow-xs ring-1 ring-slate-100 dark:bg-white/5 dark:ring-white/5">
        {selectedImage ? (
          <div className="h-full w-full">
            <img
              src={selectedImage}
              alt="Selected preview"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <button
              type="button"
              onClick={() => removeImage(images.indexOf(selectedImage))}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-xl backdrop-blur-sm transition-all hover:bg-rose-50 hover:text-rose-600 hover:scale-110 active:scale-95 dark:bg-slate-900/90 dark:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-8 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 dark:bg-white/5 dark:ring-white/5">
              <LinkIcon className="h-6 w-6 rotate-45 text-blue-600" />
            </div>
            <h4 className="text-xs font-black tracking-widest text-slate-900 uppercase dark:text-white">
              No images yet
            </h4>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
              Paste a direct image URL below to build your product gallery.
            </p>
          </div>
        )}
      </div>

      {/* 3. Thumbnails Strip */}
      {images.length > 0 && (
        <div
          ref={thumbnailsRef}
          onWheel={handleThumbnailWheel}
          className="scrollbar-premium flex h-24 w-full flex-none snap-x flex-nowrap items-center gap-3 overflow-x-auto overflow-y-hidden pb-2"
        >
          {images.map((url, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(url)}
              className={`group relative h-20 w-20 flex-none cursor-pointer snap-center overflow-hidden rounded-xl transition-all duration-300 ${
                selectedImage === url
                  ? 'ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-slate-900'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={url}
                alt={`Thumbnail ${index}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-blue-600/0 transition-colors group-hover:bg-blue-600/10" />
            </div>
          ))}
        </div>
      )}

      {/* 4. Input Section */}
      <div className="flex-none space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
            Image URL
          </label>
          {images.length > 0 && (
            <button
              type="button"
              onClick={clearAllImages}
              className="text-[9px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-rose-600"
            >
              Clear Gallery
            </button>
          )}
        </div>

        <div className="relative">
          <Input
            ref={inputRef}
            placeholder="https://images.unsplash.com/photo-..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setError(null)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addImage()
              }
            }}
            disabled={checking}
            className="input-premium h-12 pr-12 text-xs"
          />
          <div className="absolute top-1/2 right-4 -translate-y-1/2">
            {checking ? (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            ) : (
              <LinkIcon className="h-4 w-4 rotate-45 text-slate-300" />
            )}
          </div>
        </div>

        <div className="min-h-[16px]">
          {error && (
            <p className="animate-in fade-in slide-in-from-top-1 text-[10px] font-bold text-rose-500 uppercase tracking-widest">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

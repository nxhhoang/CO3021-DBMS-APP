'use client'

import { useEffect, useRef, useState } from 'react'
import { Trash2, X, Link as LinkIcon } from 'lucide-react'
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
    // 1. Container chính phải có chiều cao xác định (ví dụ h-[600px] hoặc h-full nếu cha đã có h)
    <div className="flex h-[550px] w-full min-w-0 flex-col gap-4 overflow-hidden p-1">
      {/* 2. Phần Preview ảnh lớn: flex-1 giúp nó chiếm toàn bộ diện tích còn lại */}
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[28px] bg-[#ECEFF1] shadow-sm ring-1 ring-slate-100">
        {selectedImage ? (
          <div className="h-full w-full">
            <img
              src={selectedImage}
              alt="Selected preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(images.indexOf(selectedImage))}
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-red-50"
            >
              <X className="h-4 w-4 text-red-500" />
            </button>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center text-slate-400">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200">
              <LinkIcon className="h-5 w-5 rotate-45 text-slate-500" />
            </div>
            <p className="text-sm font-medium text-slate-500">
              No image selected yet
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Paste a direct image URL below to populate the gallery.
            </p>
          </div>
        )}
      </div>

      {/* 3. Danh sách Thumbnails: Cố định chiều cao, chỉ cho phép scroll ngang */}
      <div
        ref={thumbnailsRef}
        onWheel={handleThumbnailWheel}
        className="flex h-24 w-full flex-none snap-x flex-nowrap items-center gap-3 overflow-x-auto overflow-y-hidden pb-2 [scrollbar-width:thin]"
      >
        {images.map((url, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(url)}
            className={`group relative h-20 w-20 flex-none cursor-pointer snap-center overflow-hidden rounded-2xl transition-all duration-200 ${
              selectedImage === url
                ? 'scale-95 ring-2 ring-slate-800 ring-offset-2'
                : 'hover:opacity-80'
            }`}
          >
            <img
              src={url}
              alt={`Thumbnail ${index}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* 4. Phần Input: flex-none để không bị co giãn */}
      <div className="flex-none space-y-3">
        <div className="flex items-center justify-between gap-3">
          <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Remote URL
          </label>
          {images.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAllImages}
              className="h-8 gap-2 rounded-full px-3 text-[11px] font-semibold text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete all
            </Button>
          )}
        </div>

        <div className="group relative">
          <Input
            ref={inputRef}
            placeholder="https://image-source.com/asset.jpg"
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
            className="h-12 rounded-2xl border-none bg-white pr-10 pl-4 text-sm shadow-sm ring-1 ring-slate-100 transition-all focus-visible:ring-1 focus-visible:ring-slate-300"
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2 text-blue-500">
            <LinkIcon className="h-4 w-4 rotate-45" />
          </div>
        </div>

        <div className="min-h-[20px]">
          {' '}
          {/* Giữ chỗ cho error để tránh nhảy layout */}
          {error && (
            <FieldError className="text-[11px] text-red-500">
              {error}
            </FieldError>
          )}
          {checking && (
            <p className="animate-pulse text-[11px] text-slate-400">
              Verifying image source...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

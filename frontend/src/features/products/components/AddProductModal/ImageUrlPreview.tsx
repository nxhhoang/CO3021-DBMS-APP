'use client'

import { useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field'
import { Button } from '@/components/ui/button'

interface ImageUrlPreviewProps {
  images: string[]
  onChange: (newImages: string[]) => void
}

export default function ImageUrlPreview({
  images,
  onChange,
}: ImageUrlPreviewProps) {
  const [inputValue, setInputValue] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)

  // ✅ Validate URL format
  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // ✅ Check có phải ảnh thật
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

    // ❗ duplicate
    if (images.includes(url)) {
      setError('Ảnh đã tồn tại')
      return
    }

    // ❗ validate URL
    if (!isValidUrl(url)) {
      setError('URL không hợp lệ')
      return
    }

    setChecking(true)
    setError('Đang kiểm tra ảnh...')

    const isImage = await checkImageExists(url)

    setChecking(false)

    if (!isImage) {
      setError('Không phải link ảnh hợp lệ')
      return
    }

    // ✅ OK
    onChange([...images, url])
    setInputValue('')
    setSelectedImage(url)
    setError(null)
  }

  const removeImage = (index: number) => {
    const removed = images[index]
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)

    if (selectedImage === removed) {
      setSelectedImage(newImages[0] || null)
    }
  }

  const clearAll = () => {
    onChange([])
    setSelectedImage(null)
  }

  return (
    <FieldGroup>
      {/* Thay đổi cấu trúc Header ở đây */}
      <div className="mb-2 flex items-center justify-between">
        <FieldLabel className="mb-0">Danh sách URL hình ảnh</FieldLabel>

        {images.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              clearAll()
            }}
            className="text-destructive"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Xóa tất cả
          </Button>
        )}
      </div>

      {/* 🔽 Input */}
      <Input
        placeholder="Nhập URL ảnh rồi nhấn Enter"
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
      />

      {/* 🔴 Error / trạng thái */}
      {error && <FieldError>{error}</FieldError>}

      {/* 🔥 Thumbnail list */}
      <div className="mb-4 flex flex-wrap gap-3">
        {images.map((url, index) =>
          url ? (
            <div
              key={index}
              onClick={() => setSelectedImage(url)}
              className={`group relative h-20 w-20 cursor-pointer overflow-hidden rounded-lg border ${
                selectedImage === url ? 'ring-primary ring-2' : ''
              }`}
            >
              <img
                src={url}
                alt={`Preview ${index}`}
                className="h-full w-full object-cover"
                onError={(e) =>
                  (e.currentTarget.src =
                    'https://placehold.co/100x100?text=Error')
                }
              />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage(index)
                }}
                className="absolute top-1 right-1 hidden rounded-full bg-black/60 p-1 text-white group-hover:block"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : null,
        )}
      </div>
      {/* 🔥 Preview lớn */}
      {selectedImage && (
        <div className="bg-muted mb-4 h-60 w-full overflow-hidden rounded-lg border">
          <img
            src={selectedImage}
            alt="Selected preview"
            className="h-full w-full object-contain"
          />
        </div>
      )}
    </FieldGroup>
  )
}

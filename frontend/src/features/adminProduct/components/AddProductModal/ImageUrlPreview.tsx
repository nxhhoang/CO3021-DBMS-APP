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
import { Label } from '@/components/ui/label'

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
    <FieldGroup className="bg-primary-foreground rounded-lg p-4">
      <Label className="text-lg font-semibold">Ảnh</Label>
      <div>
        <div className="flex flex-col gap-2">
          {/* Thay đổi cấu trúc Header ở đây */}
          <div className="flex items-center justify-between">
            <FieldLabel className="text-md w-auto">
              Danh sách URL hình ảnh
            </FieldLabel>

            {images.some((url) => url.trim() !== '') && (
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
            placeholder="Nhập URL ảnh"
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
            className="bg-muted-foreground/6 border"
          />
        </div>
        {/* 🔴 Error / trạng thái - Giữ chỗ cố định */}
        <div>
          {error ? (
            <FieldError className="mt-2 text-xs leading-none">
              {error}
            </FieldError>
          ) : checking ? (
            <p className="text-muted-foreground animate-pulse text-xs">
              Đang kiểm tra ảnh...
            </p>
          ) : null}
        </div>
      </div>

      {/* 🔥 Thumbnail list */}
      <div className="mb-4 flex flex-wrap gap-3">
        {images.map((url, index) =>
          url ? (
            <div
              key={index}
              onClick={() => setSelectedImage(url)}
              className={`group relative h-20 w-20 cursor-pointer overflow-hidden rounded-lg ${
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
      <div className="bg-muted-foreground/6 mb-4 flex h-80 w-full items-center justify-center overflow-hidden rounded-lg">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Selected preview"
            className="h-full w-full object-contain transition-all"
          />
        ) : (
          <div className="text-muted-foreground flex flex-col items-center text-sm italic">
            Chưa có ảnh nào được chọn
          </div>
        )}
      </div>
    </FieldGroup>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SearchBar } from '@/components/common/SearchBar'

interface ProductSearchProps {
  variant?: 'header' | 'filter' | 'admin'
  className?: string
  onAfterSearch?: () => void
}

export function ProductSearch({
  variant = 'filter',
  className,
  onAfterSearch,
}: ProductSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '')

  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '')
  }, [searchParams])

  const handleSubmit = (value: string) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    const params = new URLSearchParams(searchParams.toString())
    if (value.trim()) {
      params.set('keyword', value.trim())
    } else {
      params.delete('keyword')
    }
    params.delete('category')
    params.set('page', '1')
    Array.from(params.keys()).forEach((key) => {
      if (key.startsWith('attrs[')) params.delete(key)
    })

    router.push(`/products?${params.toString()}`)
    onAfterSearch?.()
  }

  return (
    <SearchBar
      value={keyword}
      onChange={setKeyword}
      onSubmit={handleSubmit}
      variant={variant}
      className={className}
    />
  )
}

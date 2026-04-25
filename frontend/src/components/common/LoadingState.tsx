'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  message?: string
  className?: string
  fullPage?: boolean
}

export const LoadingState = ({
  message = 'Đang tải dữ liệu...',
  className,
  fullPage = false,
}: LoadingStateProps) => {
  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        className,
      )}
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-100 border-t-blue-600" />
        <Loader2 className="h-6 w-6 animate-pulse text-blue-600" />
      </div>
      <p className="font-display text-sm font-bold tracking-tight text-slate-500">
        {message}
      </p>
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return content
}

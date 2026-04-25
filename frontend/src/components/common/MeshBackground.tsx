'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface MeshBackgroundProps {
  className?: string
  variant?: 'default' | 'subtle' | 'admin' | 'premium'
}

export const MeshBackground = ({
  className,
  variant = 'default',
}: MeshBackgroundProps) => {
  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 -z-10 overflow-hidden',
        className,
      )}
    >
      <div className="absolute inset-0 bg-white dark:bg-slate-950" />

      {/* Dynamic Blobs */}
      <div
        className={cn(
          'absolute -top-[10%] -left-[10%] h-[50%] w-[50%] animate-pulse rounded-full opacity-30 blur-[120px] transition-all duration-1000',
          variant === 'default' && 'bg-blue-400',
          variant === 'subtle' && 'bg-slate-200',
          variant === 'admin' && 'bg-indigo-500',
          variant === 'premium' && 'bg-cyan-400',
        )}
      />
      <div
        className={cn(
          'absolute top-[10%] -right-[10%] h-[40%] w-[40%] animate-bounce rounded-full opacity-20 blur-[100px] transition-all delay-300 duration-1000',
          variant === 'default' && 'bg-purple-400',
          variant === 'subtle' && 'bg-slate-100',
          variant === 'admin' && 'bg-slate-400',
          variant === 'premium' && 'bg-blue-500',
        )}
      />
      <div
        className={cn(
          'absolute -bottom-[10%] left-[20%] h-[30%] w-[60%] rounded-full opacity-25 blur-[110px] transition-all delay-700 duration-1000',
          variant === 'default' && 'bg-pink-300',
          variant === 'subtle' && 'bg-slate-200',
          variant === 'admin' && 'bg-blue-600',
          variant === 'premium' && 'bg-indigo-400',
        )}
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] bg-center opacity-[0.03]" />
    </div>
  )
}

'use client'

import { cn } from '@/lib/utils'

interface UserPageHeaderProps {
  title: string
  subtitle: string
  action?: React.ReactNode
  className?: string
}

export function UserPageHeader({
  title,
  subtitle,
  action,
  className,
}: UserPageHeaderProps) {
  return (
    <div
      className={cn(
        'animate-in fade-in flex flex-col gap-4 duration-300 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-6 rounded-full bg-blue-600" />
          <h2 className="font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
        </div>
        <p className="font-medium text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

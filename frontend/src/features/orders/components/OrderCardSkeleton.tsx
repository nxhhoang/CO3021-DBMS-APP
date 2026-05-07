import { Skeleton } from '@/components/ui/skeleton'

export function OrderCardSkeleton() {
  return (
    <div className="glass-card animate-pulse p-8">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-6">
          <Skeleton className="h-16 w-16 shrink-0 rounded-3xl bg-slate-200" />
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-24 rounded-md bg-slate-200" />
              <Skeleton className="h-6 w-20 rounded-full bg-slate-200" />
            </div>
            <Skeleton className="h-4 w-32 rounded-md bg-slate-200" />
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="space-y-2 text-right">
            <Skeleton className="ml-auto h-3 w-16 rounded-md bg-slate-200" />
            <Skeleton className="h-8 w-32 rounded-md bg-slate-200" />
          </div>
          <Skeleton className="h-14 w-32 rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  )
}

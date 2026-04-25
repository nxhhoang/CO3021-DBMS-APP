'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star, Loader2, MessageSquarePlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Review } from '@/types'

interface ProductReviewsTabProps {
  avgRating: number
  reviews: Review[]
  reviewsLoading: boolean
  formatReviewDate: (date: string) => string
}

export const ProductReviewsTab = ({
  avgRating,
  reviews,
  reviewsLoading,
  formatReviewDate,
}: ProductReviewsTabProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-10 duration-500">
      {/* MINIMAL RATING SUMMARY */}
      <div className="flex items-center gap-8 border-b border-slate-100 pb-8 dark:border-white/5">
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold tracking-tighter text-slate-900 dark:text-white">
            {avgRating || 0}
          </span>
          <div className="mt-2 flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={`avg-star-${idx}`}
                className={cn(
                  'h-3.5 w-3.5',
                  idx < Math.round(avgRating || 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-200 dark:text-slate-800',
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            Tổng hợp đánh giá
          </div>
          <p className="text-xs text-slate-500">
            Dựa trên {reviews.length} lượt đánh giá thực tế từ người dùng.
          </p>
        </div>
      </div>

      {/* REVIEWS LIST */}
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Tất cả đánh giá ({reviews.length})
          </h4>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/5">
          {reviewsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-12 text-center text-sm font-medium text-slate-400 italic">
              Chưa có đánh giá nào cho sản phẩm này.
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="py-6 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 dark:bg-white/5 dark:text-slate-400">
                      {(review.userName?.charAt(0) || 'U').toUpperCase()}
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {review.userName || 'Người dùng'}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={`${review._id}-${idx}`}
                              className={cn(
                                'h-2.5 w-2.5',
                                idx < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-slate-200 dark:text-slate-800',
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-medium text-slate-400">
                          {formatReviewDate(review.createdAt)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}


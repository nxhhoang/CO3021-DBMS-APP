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
  reviewRating: number
  setReviewRating: (rating: number) => void
  reviewComment: string
  setReviewComment: (comment: string) => void
  reviewSubmitting: boolean
  onSubmitReview: () => void
  formatReviewDate: (date: string) => string
}

export const ProductReviewsTab = ({
  avgRating,
  reviews,
  reviewsLoading,
  reviewRating,
  setReviewRating,
  reviewComment,
  setReviewComment,
  reviewSubmitting,
  onSubmitReview,
  formatReviewDate,
}: ProductReviewsTabProps) => {
  const trimmedReviewComment = reviewComment.trim()
  const isReviewCommentValid = trimmedReviewComment.length >= 10
  const canSubmitReview =
    !reviewSubmitting &&
    reviewRating >= 1 &&
    reviewRating <= 5 &&
    isReviewCommentValid

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
      <div className="space-y-6">
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

      {/* MINIMAL SUBMIT FORM */}
      <div className="rounded-3xl border border-slate-100 bg-slate-50/20 p-8 dark:border-white/5 dark:bg-white/5">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-900">
              <MessageSquarePlus size={20} className="text-blue-600" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Đánh giá sản phẩm
              </h4>
              <p className="text-xs text-slate-400">
                Ý kiến của bạn rất quan trọng với chúng tôi
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, idx) => {
                const value = idx + 1
                const isActive = value <= reviewRating
                return (
                  <button
                    key={`new-review-star-${value}`}
                    type="button"
                    onClick={() => setReviewRating(value)}
                    className="transition-all active:scale-90"
                  >
                    <Star
                      className={cn(
                        'h-6 w-6 transition-colors',
                        isActive
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-200 hover:text-yellow-400/50 dark:text-slate-700',
                      )}
                    />
                  </button>
                )
              })}
            </div>
            <div className="text-[10px] font-black tracking-widest text-blue-600 uppercase">
              {reviewRating === 5
                ? 'Rất hài lòng'
                : reviewRating >= 4
                  ? 'Hài lòng'
                  : reviewRating >= 3
                    ? 'Bình thường'
                    : 'Không hài lòng'}
            </div>
          </div>

          <div className="relative">
            <Textarea
              value={reviewComment}
              onChange={(event) => setReviewComment(event.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              className="min-h-[140px] resize-none border-none bg-white p-4 text-sm shadow-xs transition-all focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-900"
              maxLength={500}
            />
            <div className="absolute right-4 bottom-3 text-[10px] font-bold text-slate-300">
              {reviewComment.length}/500
            </div>
          </div>

          <Button
            type="button"
            onClick={onSubmitReview}
            disabled={!canSubmitReview}
            className="h-12 w-full rounded-xl bg-blue-600 text-xs font-bold tracking-widest text-white uppercase transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-white/5"
          >
            {reviewSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Gửi đánh giá ngay'
            )}
          </Button>
          {!isReviewCommentValid && (
            <p className="text-center text-xs text-slate-400">
              Nội dung đánh giá cần tối thiểu 10 ký tự.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

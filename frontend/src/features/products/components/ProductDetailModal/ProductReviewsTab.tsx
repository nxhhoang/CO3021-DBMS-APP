'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star, Loader2 } from 'lucide-react'
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
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* RATING SUMMARY */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/40 p-10 text-center shadow-xl shadow-slate-200/50 backdrop-blur-3xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <div className="relative z-10 space-y-3">
          <div className="font-mono text-7xl font-black tracking-tighter text-slate-900 dark:text-white">{avgRating || 0}</div>
          <div className="flex items-center justify-center gap-1.5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={`avg-star-${idx}`}
                className={cn(
                  'h-6 w-6',
                  idx < Math.round(avgRating || 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-200 dark:text-slate-800',
                )}
              />
            ))}
          </div>
          <p className="font-display text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Dựa trên {reviews.length} phản hồi thực tế
          </p>
        </div>
        {/* Decorative element */}
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-500/10 blur-[60px]" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-[60px]" />
      </div>

      {/* REVIEWS LIST */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-1 w-4 rounded-full bg-slate-400" />
          <h4 className="font-display text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">
            Danh sách phản hồi
          </h4>
        </div>

        <div className="space-y-4">
          {reviewsLoading ? (
            <div className="flex items-center justify-center gap-4 rounded-3xl border border-slate-100 bg-slate-50/30 p-16 text-slate-500 dark:border-white/5 dark:bg-white/5">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="font-display font-bold">Đang tải dữ liệu...</span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-[2.5rem] border border-slate-100 bg-slate-50/30 p-20 text-center dark:border-white/5 dark:bg-white/5">
              <p className="font-display text-lg font-bold text-slate-400 italic">
                Chưa có đánh giá nào cho sản phẩm này.
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="group space-y-4 rounded-[2rem] border border-slate-50 bg-white p-8 transition-all hover:border-blue-100 hover:shadow-xl hover:shadow-slate-200/50 dark:border-white/5 dark:bg-slate-900/50"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 font-display text-sm font-black uppercase text-white dark:bg-white dark:text-slate-900">
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-display text-base font-black text-slate-900 dark:text-white">{review.userName}</div>
                      <div className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {formatReviewDate(review.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={`${review._id}-${idx}`}
                        className={cn(
                          'h-3.5 w-3.5',
                          idx < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200 dark:text-slate-800',
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SUBMIT FORM */}
      <div className="space-y-10 border-t border-slate-100 pt-12 dark:border-white/5">
        <div className="text-center">
          <h4 className="font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white">Viết đánh giá của bạn</h4>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Trải nghiệm của bạn sẽ là nguồn cảm hứng cho cộng đồng.
          </p>
        </div>

        <div className="space-y-8">
          {/* Star Rating Selection */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              {Array.from({ length: 5 }).map((_, idx) => {
                const value = idx + 1
                const isActive = value <= reviewRating
                return (
                  <button
                    key={`new-review-star-${value}`}
                    type="button"
                    onClick={() => setReviewRating(value)}
                    className="group relative p-1.5 transition-all active:scale-90"
                  >
                    <Star
                      className={cn(
                        'h-10 w-10 transition-all duration-300',
                        isActive ? 'fill-yellow-400 text-yellow-400 scale-110' : 'text-slate-200 dark:text-slate-800 group-hover:text-yellow-400/50',
                      )}
                    />
                    {isActive && (
                      <div className="absolute inset-0 -z-10 animate-ping rounded-full bg-yellow-400/20" />
                    )}
                  </button>
                )
              })}
            </div>
            <div className="rounded-full bg-slate-900 px-4 py-1.5 dark:bg-white">
              <span className="font-display text-[10px] font-black text-white uppercase tracking-[0.2em] dark:text-slate-900">
                {reviewRating === 5
                  ? 'Tuyệt vời'
                  : reviewRating >= 4
                    ? 'Rất tốt'
                    : reviewRating >= 3
                      ? 'Bình thường'
                      : 'Kém'}
              </span>
            </div>
          </div>

          <div className="group relative">
            <Textarea
              value={reviewComment}
              onChange={(event) => setReviewComment(event.target.value)}
              placeholder="Chia sẻ cảm nhận chi tiết của bạn về sản phẩm..."
              className="min-h-48 resize-none rounded-[2.5rem] border-slate-100 bg-slate-50/30 p-10 text-base leading-relaxed transition-all focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-500/5 dark:border-white/5 dark:bg-white/5 dark:focus:bg-slate-900"
              maxLength={500}
            />
            <div className="absolute right-8 bottom-8 flex items-center gap-4">
              <span className="font-mono text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                {reviewComment.length} / 500
              </span>
            </div>
          </div>

          <Button
            type="button"
            onClick={onSubmitReview}
            disabled={reviewSubmitting}
            className="h-16 w-full rounded-full bg-slate-900 text-[11px] font-black tracking-[0.3em] text-white uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:bg-slate-50 disabled:text-slate-300 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            {reviewSubmitting ? (
              <span className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                Đang gửi đi
              </span>
            ) : (
              'Gửi đánh giá của bạn'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

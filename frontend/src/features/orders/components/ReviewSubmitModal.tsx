'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star, Loader2, MessageSquarePlus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import reviewService from '@/services/review.service'
import { toast } from 'sonner'

interface Props {
  productId: string | null
  productName: string | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const ReviewSubmitModal = ({
  productId,
  productName,
  isOpen,
  onClose,
  onSuccess,
}: Props) => {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = () => {
    if (isSubmitting) return
    setRating(5)
    setComment('')
    onClose()
  }

  const handleSubmit = async () => {
    if (!productId) return
    if (comment.trim().length < 10) {
      toast.error('Nội dung đánh giá cần tối thiểu 10 ký tự')
      return
    }

    setIsSubmitting(true)
    try {
      await reviewService.createReview(
        { productId },
        {
          rating,
          comment: comment.trim(),
        },
      )
      toast.success('Đánh giá của bạn đã được gửi thành công!')
      onSuccess?.()
      handleClose()
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md overflow-hidden border-none bg-white/95 p-0 shadow-2xl backdrop-blur-3xl sm:rounded-[2rem] dark:bg-slate-900/95">
        <DialogHeader className="shrink-0 border-b border-slate-100 p-6 dark:border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                <MessageSquarePlus size={20} />
              </div>
              <div>
                <DialogTitle className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Đánh giá sản phẩm
                </DialogTitle>
                <p className="max-w-[200px] truncate text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  {productName}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              disabled={isSubmitting}
              onClick={handleClose}
              className="rounded-full hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-8 p-8">
          {/* Star Rating */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, idx) => {
                const value = idx + 1
                const isActive = value <= rating
                return (
                  <button
                    key={`star-${value}`}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setRating(value)}
                    className="transition-all hover:scale-110 active:scale-90 disabled:opacity-50"
                  >
                    <Star
                      className={cn(
                        'h-8 w-8 transition-colors',
                        isActive
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-200 dark:text-slate-800',
                      )}
                    />
                  </button>
                )
              })}
            </div>
            <p className="font-display text-[11px] font-black tracking-[0.2em] text-blue-600 uppercase">
              {rating === 5
                ? 'Rất tuyệt vời'
                : rating === 4
                  ? 'Rất tốt'
                  : rating === 3
                    ? 'Bình thường'
                    : rating === 2
                      ? 'Không hài lòng'
                      : 'Rất tệ'}
            </p>
          </div>

          {/* Comment Area */}
          <div className="space-y-2">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              className="min-h-[150px] resize-none rounded-2xl border-slate-100 bg-slate-50/50 p-4 text-sm font-medium transition-all focus:ring-2 focus:ring-blue-600/20 dark:border-white/5 dark:bg-white/5"
              maxLength={500}
            />
            <div className="flex justify-between text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              <span>Tối thiểu 10 ký tự</span>
              <span>{comment.length}/500</span>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-slate-50/50 p-6 dark:bg-slate-800/50">
          <div className="flex w-full gap-3">
            <Button
              variant="ghost"
              disabled={isSubmitting}
              onClick={handleClose}
              className="font-display h-12 flex-1 rounded-xl text-[10px] font-bold tracking-widest text-slate-500 uppercase"
            >
              Hủy bỏ
            </Button>
            <Button
              disabled={isSubmitting || comment.trim().length < 10}
              onClick={handleSubmit}
              className="btn-premium-primary h-12 flex-2 rounded-xl"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Gửi đánh giá'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

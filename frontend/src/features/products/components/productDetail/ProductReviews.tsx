'use client';

import { formatDate } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { useReviews } from '../../hooks/useReviews';
import { Review } from '@/types';
import { Star } from 'lucide-react';

function ProductReviewItem({ review }: { review: Review }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">{review.userName}</span>

        {/* Rating */}
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < review.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted'
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-muted-foreground text-sm">{review.comment}</p>
    </div>
  );
}

export default function ProductReviews() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { reviews, loading } = useReviews(id ?? '');
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Customer Reviews</h2>
      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <ProductReviewItem key={review._id} review={review} />
        ))
      )}
    </div>
  );
}

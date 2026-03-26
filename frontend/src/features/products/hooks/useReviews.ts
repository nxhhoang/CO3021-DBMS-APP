'use client';

import { useState, useEffect, useCallback } from 'react';
import { Review } from '@/types';
import { reviewService } from '../services/reviews.service';
import { getErrorMessage } from '@/lib/utils';

export const useReviews = (productId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await reviewService.getReviews(productId);
      setReviews(response.data ?? []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (!productId) return;
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, error, refresh: fetchReviews };
};

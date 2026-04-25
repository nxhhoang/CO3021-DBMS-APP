import { useEffect, useState } from 'react';
import categoryService from '@/services/category.service';
import { Category } from '@/types/category.types';

export default function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await categoryService.getCategories({ isActive: true })

      setCategories(res.data ?? [])
    } catch (error) {
      console.error('Failed to fetch categories', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return { categories, loading, refetch: fetchCategories }
}

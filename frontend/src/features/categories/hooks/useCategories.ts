'use client';

import { useEffect, useState } from "react";
import { categoryService } from "../services/categories.service";
import { Category } from "@/types";


export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await categoryService.getCategories({ isActive: true });
      setCategories(res.data ?? []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
    setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, isLoading, fetchCategories };
};


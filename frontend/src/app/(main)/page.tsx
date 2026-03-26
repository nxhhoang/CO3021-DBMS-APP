'use client';

import { CategoryCard, useCategories } from '@/features/categories';

export default function HomePage() {
  const { categories } = useCategories();

  return (
    <div className="container mx-auto py-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Chào mừng đến với BKShop!</h1>
        <p className="text-muted-foreground mb-6 text-lg">
          Tìm kiếm sản phẩm yêu thích của bạn ngay bây giờ!
        </p>
      </div>

      {/* Categories Section */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </div>
    </div>
  );
}

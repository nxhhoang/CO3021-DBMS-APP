'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';

// Dữ liệu giả lập
const MOCK_PRODUCTS = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  name: `Macbook Pro M${(i % 3) + 2} ${2023 + (i % 2)}`,
  img: 'https://via.placeholder.com/300x400',
  base_price: 25000000 + i * 1000000,
  avg_rating: 4.5 + (i % 5) * 0.1,
  total_sold: 150 + i * 10,
  total_reviews: 50 + i * 5,
}));

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || 'macbook';
  const [priceRange, setPriceRange] = useState([0, 100000000]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">
        Tìm thấy {MOCK_PRODUCTS.length} sản phẩm liên quan đến "{keyword}"
      </h1>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar lọc */}
        <aside className="w-full space-y-6 md:w-64">
          <div>
            <h3 className="mb-2 font-semibold">Khoảng giá</h3>
            <Slider
              defaultValue={[0, 100000000]}
              max={100000000}
              step={1000000}
              className="mb-2"
            />
            <div className="text-sm text-gray-500">
              {priceRange[0].toLocaleString()}đ -{' '}
              {priceRange[1].toLocaleString()}đ
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Danh mục</h3>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Sắp xếp theo</h3>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Mặc định" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price_asc">Giá thấp đến cao</SelectItem>
                <SelectItem value="price_desc">Giá cao đến thấp</SelectItem>
                <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </aside>

        {/* Danh sách sản phẩm */}
        <main className="flex-1">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_PRODUCTS.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden rounded-2xl transition-shadow hover:shadow-lg"
              >
                <img
                  src={product.img}
                  alt={product.name}
                  className="h-48 w-full object-cover"
                />
                <CardHeader className="p-4">
                  <h2 className="text-lg font-bold">{product.name}</h2>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-primary text-xl font-bold">
                    {product.base_price.toLocaleString()}đ
                  </p>
                  <p className="text-sm text-gray-600">
                    Đánh giá: {product.avg_rating} ⭐ ({product.total_reviews}{' '}
                    đánh giá)
                  </p>
                  <p className="text-sm text-gray-600">
                    Đã bán: {product.total_sold}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full">Thêm vào giỏ</Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </main>
      </div>
    </div>
  );
}

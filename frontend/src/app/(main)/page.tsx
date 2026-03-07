// Create a landing page for an e-commerce website. The page should include a Search bar in the middle with some text above, below it is some card for some categories of products. The page should be responsive and look good on both desktop and mobile devices, correct padding and margins, and use a modern design with a clean layout and attractive colors. Use Tailwind CSS for styling.

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
//import some icon for category from lucide-react
import {
  Store,
  Smartphone,
  Laptop,
  Headphones,
  Shapes,
  Volleyball,
  Shirt,
  Search,
} from 'lucide-react';

import { SearchBar } from '@/components/Shared/SearchBar';

// add a category list with 6 categories, each category has a name, an icon, and a description.
const categories = [
  {
    name: 'Điện thoại',
    icon: Smartphone,
    description: 'Khám phá các mẫu điện thoại mới nhất và tốt nhất.',
  },
  {
    name: 'Laptop',
    icon: Laptop,
    description: 'Khám phá các mẫu laptop mới nhất và tốt nhất.',
  },
  {
    name: 'Phụ kiện',
    icon: Headphones,
    description: 'Khám phá các phụ kiện cho thiết bị của bạn.',
  },
  {
    name: 'Thể thao',
    icon: Volleyball,
    description: 'Khám phá các sản phẩm thể thao mới nhất và tốt nhất.',
  },
  {
    name: 'Đồ chơi',
    icon: Shapes,
    description: 'Khám phá các mẫu đồ chơi mới nhất và tốt nhất.',
  },
  {
    name: 'Thời trang',
    icon: Shirt,
    description: 'Khám phá các mẫu thời trang mới nhất và tốt nhất.',
  },
];

export default function HomePage() {
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
          <Card
            key={category.name}
            className="transition-shadow hover:shadow-lg"
          >
            <CardHeader>
              <category.icon className="text-primary mb-2 h-8 w-8" />
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{category.description}</p>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button variant="outline" size="sm">
                Xem chi tiết
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

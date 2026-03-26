'use client';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Category } from '@/types/category.types';

export function CategoryCard({ category }: { category: Category }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products?category=${category.slug}`);
  };
  return (
    <Card
      key={category.name}
      className="cursor-pointer transition-shadow hover:shadow-lg"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="text-primary mb-2 h-8 w-8 rounded-full" />
        <CardTitle>{category.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{category.description}</p>
      </CardContent>
      <CardFooter className="border-t px-6 py-4"></CardFooter>
    </Card>
  );
}

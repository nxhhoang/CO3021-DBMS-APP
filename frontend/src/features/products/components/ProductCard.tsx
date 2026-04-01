import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ProductResponse } from '@/types/product.types';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ProductCard = ({ product }: { product: ProductResponse }) => {
  return (
    <Card className="overflow-hidden rounded-lg transition-shadow hover:shadow-md">
      <AspectRatio ratio={1}>
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover"
        />
      </AspectRatio>

      <CardContent className="space-y-2 p-3">
        <Badge variant="secondary" className="text-xs">
          {product.category.name}
        </Badge>

        <h3 className="line-clamp-2 text-sm font-medium">{product.name}</h3>

        <p className="text-primary text-sm font-bold">
          {product.basePrice.toLocaleString()}$
        </p>

        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          {product.avg_rating}

          {product.total_reviews > 0 && <span>({product.total_reviews})</span>}

          <span className="ml-auto">Đã bán {product.total_sold}</span>
        </div>
      </CardContent>
      <CardFooter className="px-3">
        <Button variant="default" size="sm" className="w-full">
          Thêm vào giỏ hàng
        </Button>
      </CardFooter>
    </Card>
  )
};

export default ProductCard;

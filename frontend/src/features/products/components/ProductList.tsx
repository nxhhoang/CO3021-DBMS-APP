import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductResponse } from '@/types/product.types';

type Props = {
  products: ProductResponse[];
  loading: boolean;
};

const ProductList = ({ products, loading }: Props) => {
  return (
    <main className="bg-muted flex-1 rounded-sm p-2 md:p-4">
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};

export default ProductList;

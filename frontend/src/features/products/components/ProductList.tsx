import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductResponse } from '@/types/product.types';

type Props = {
  products: ProductResponse[];
  loading: boolean;
};

const ProductList = ({ products, loading }: Props) => {
  if (!loading && products.length === 0) {
    return (
      <div className="py-20 text-center">Không tìm thấy sản phẩm nào!</div>
    );
  }
  return (
    <main className="flex-1">
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="h-[420px] rounded-[2rem]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};

export default ProductList;

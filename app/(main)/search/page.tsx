import ProductCard from '@/components/product/ProductCard';
import Filters from '@/components/search/Filters';
import { mockProducts } from '@/data/mock-products';

export default function SearchPage() {
  // This will be replaced by API call based on search query
  const products = mockProducts;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="col-span-1">
          <Filters />
        </div>
        <div className="col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

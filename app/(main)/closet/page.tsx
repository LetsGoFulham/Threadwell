import ProductCard from '@/components/product/ProductCard';
import { mockProducts } from '@/data/mock-products';

export default function ClosetPage() {
  // This will be replaced by API call to get user's saved items
  const savedItems = mockProducts.slice(0, 3);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Closet</h1>
      {savedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {savedItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>You haven't saved any items yet.</p>
      )}
    </div>
  );
}

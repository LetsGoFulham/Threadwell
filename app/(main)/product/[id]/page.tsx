import { mockProducts } from '@/data/mock-products';
import { Product } from '@/types';
import Image from 'next/image';

type ProductDetailPageProps = {
  params: {
    id: string;
  };
};

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  // This will be replaced by an API call to fetch product details
  const product: Product | undefined = mockProducts.find(p => p.id === params.id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={500}
          height={500}
          className="rounded-lg shadow-lg"
        />
      </div>
      <div>
        <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-500 mb-4">{product.store}</p>
        <p className="text-3xl font-semibold text-blue-600 mb-6">${product.price.toFixed(2)}</p>
        <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
        
        <button className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
          Add to Closet
        </button>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Product Details</h2>
          {/* Placeholder for more product details */}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          {/* Placeholder for reviews */}
        </div>

         <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
          {/* Placeholder for shipping estimates */}
        </div>
      </div>
    </div>
  );
}

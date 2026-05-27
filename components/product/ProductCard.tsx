import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        <div className="relative h-48 w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold mb-2 flex-grow">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-2">{product.store}</p>
          <div className="flex justify-between items-center mt-auto">
            <p className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
            {/* Placeholder for rating */}
            <div className="text-sm text-gray-600">{product.rating.toFixed(1)} ★</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

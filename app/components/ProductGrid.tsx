'use client'

import Image from 'next/image';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const ProductGrid = ({ products, onProductClick }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-xl text-gray-500">No products available in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => {
        const imageUrl = product.image ? product.image : (product.images && product.images.length > 0 ? product.images[0] : '');
        const finalImageUrl = imageUrl && imageUrl.trim() ? imageUrl : '/placeholder.jpg';
        
        return (
          <button
            key={product.id}
            onClick={() => onProductClick(product)}
            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 text-left"
          >
            <div className="relative h-64 w-full bg-gray-100">
              <Image
                src={finalImageUrl}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  console.error(`Failed to load image for ${product.name}:`, finalImageUrl);
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.jpg';
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              <p className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ProductGrid;

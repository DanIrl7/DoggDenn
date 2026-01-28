'use client'

import Image from 'next/image';
import { useState } from 'react';
import { Product } from '../types';
import { useCartStore } from '@/app/store/cartStore';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const ProductGrid = ({ products, onProductClick }: ProductGridProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

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
          <div
            key={product.id}
            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 text-left cursor-pointer"
            onClick={() => onProductClick(product)}
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
              <p className="text-2xl font-bold text-blue-600 mb-3">${product.price.toFixed(2)}</p>
              
              {/* Quantity Selector */}
              <div className="flex items-center gap-2 mb-3">
                <label className="text-sm font-medium text-gray-700">Qty:</label>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const current = quantities[product.id] || 1;
                    if (current > 1) {
                      setQuantities({ ...quantities, [product.id]: current - 1 });
                    }
                  }}
                  className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantities[product.id] || 1}
                  onChange={(e) => {
                    e.stopPropagation();
                    const val = parseInt(e.target.value, 10) || 1;
                    setQuantities({ ...quantities, [product.id]: Math.max(1, val) });
                  }}
                  className="w-12 border border-gray-300 rounded px-2 py-1 text-center"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const current = quantities[product.id] || 1;
                    setQuantities({ ...quantities, [product.id]: current + 1 });
                  }}
                  className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const quantity = quantities[product.id] || 1;
                  addItem(product, quantity);
                  setQuantities({ ...quantities, [product.id]: 1 });
                }}
                className="w-full bg-[#7d3d23] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Add to Cart
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;

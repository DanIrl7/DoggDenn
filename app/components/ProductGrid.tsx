'use client'

import Image from 'next/image';
import { useState } from 'react';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product, quantity: number) => void;
  onDirectAddToCart: (product: Product, quantity: number) => Promise<void>;
}

const ProductGrid = ({ products, onProductClick, onDirectAddToCart }: ProductGridProps) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-xl text-gray-500">No products available in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 justify-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {products.map(product => {
        const imageUrl = product.image ? product.image : (product.images && product.images.length > 0 ? product.images[0] : '');
        const finalImageUrl = imageUrl && imageUrl.trim() ? imageUrl : '/placeholder.jpg';
        
        return (
          <div
            key={product.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 text-left cursor-pointer w-full max-w-sm"
            onClick={() => onProductClick(product, 1)}
          >
            <div className="relative aspect-[9/10] md:aspect-square lg:aspect-square w-full bg-gray-100">
              <Image
                src={finalImageUrl}
                alt={product.name}
                fill
                objectFit='fill'
                className="hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 63vw, 55vw"
              />
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">{product.description}</p>
              <p className="text-lg sm:text-2xl font-bold text-primary mb-2 sm:mb-3">${product.price.toFixed(2)}</p>
              
              {/* Quantity Selector */}
              <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
                <label className="text-xs sm:text-sm font-medium text-gray-700">Qty:</label>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const current = quantities[product.id] || 1;
                    if (current > 1) {
                      setQuantities({ ...quantities, [product.id]: current - 1 });
                    }
                  }}
                  className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
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
                  className="w-10 sm:w-12 border border-gray-300 rounded px-2 py-1 text-center text-sm"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const current = quantities[product.id] || 1;
                    setQuantities({ ...quantities, [product.id]: current + 1 });
                  }}
                  className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  const quantity = quantities[product.id] || 1;
                  setLoadingProductId(product.id);
                  try {
                    await onDirectAddToCart(product, quantity);
                  } finally {
                    setLoadingProductId(null);
                  }
                }}
                disabled={loadingProductId === product.id}
                className={`w-full text-white py-2 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 ${
                  loadingProductId === product.id
                    ? 'bg-black opacity-70 cursor-not-allowed'
                    : 'bg-black hover:opacity-90'
                }`}
              >
                {loadingProductId === product.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;

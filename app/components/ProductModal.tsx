'use client'

import Image from 'next/image';
import { Product } from '../types';

interface ProductModalProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onClose: () => void;
}

const ProductModal = ({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  onClose,
}: ProductModalProps) => {
  const imageUrl = product.image ? product.image : (product.images && product.images.length > 0 ? product.images[0] : '');
  const finalImageUrl = imageUrl && imageUrl.trim() ? imageUrl : '/placeholder.jpg';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-10"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Product Image */}
          <div className="relative h-96 w-full bg-gray-100">
            <Image
              src={finalImageUrl}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
              onError={(e) => {
                console.error(`Failed to load image for ${product.name}:`, finalImageUrl);
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.jpg';
              }}
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
              <p className="text-4xl font-bold text-blue-600 mb-4">${product.price.toFixed(2)}</p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">{product.description}</p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => onQuantityChange(quantity - 1)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => onQuantityChange(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={onAddToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;

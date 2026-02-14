'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { Product } from '@/app/types';
import ProductModal from './ProductModal';
import { useCartStore } from '@/app/store/cartStore';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    slidesToScroll: 1,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        // Take only first 6 products
        setProducts(data.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleAddToCart = () => {
    if (selectedProduct) {
      addItem(selectedProduct, quantity);
      setSelectedProduct(null);
      setQuantity(1);
    }
  };

  if (loading) {
    return (
      <section className="w-full px-4 md:px-12 py-16 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12">Featured Products</h2>
        <div className="h-80 bg-gray-200 rounded-lg animate-pulse" />
      </section>
    );
  }

  return (
    <>
      <section className="w-full px-4 md:px-12 py-16 bg-[#FAF8F3]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#2C2C2C]">Featured Products</h2>
          
          <div className="relative">
            {/* Carousel */}
            <div className="overflow-hidden rounded-lg" ref={emblaRef}>
              <div className="flex -ml-4">
                {products.map((product) => {
                  const imageUrl = product.image || (product.images?.[0] || '/placeholder.jpg');
                  
                  return (
                    <div
                      key={product.id}
                      className="relative flex-none w-full md:w-1/2 lg:w-1/3 pl-4 cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="group rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white">
                        {/* Product Image */}
                        <div className="relative w-full pb-[100%] bg-gray-100 rounded-3xl overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="absolute inset-0 object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.jpg';
                            }}
                          />
                        </div>

                        {/* Product Name */}
                        <div className="p-4 bg-white">
                          <h3 className="text-lg font-bold text-[#2C2C2C] text-center line-clamp-2">
                            {product.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-3 shadow-md hover:bg-opacity-90 transition-opacity duration-200 z-10"
              onClick={scrollPrev}
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-3 shadow-md hover:bg-opacity-90 transition-opacity duration-200 z-10"
              onClick={scrollNext}
              aria-label="Next slide"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onAddToCart={handleAddToCart}
          onClose={() => {
            setSelectedProduct(null);
            setQuantity(1);
          }}
        />
      )}
    </>
  );
}

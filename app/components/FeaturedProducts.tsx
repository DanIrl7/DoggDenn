'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { Product } from '@/app/types';
import ProductModal from './ProductModal';
import { useCartStore } from '@/app/store/cartStore';
import { useToast } from './ToastProvider';
import { useInView } from '@/app/hooks/useInView';

export default function FeaturedProducts() {
  const router = useRouter();
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const { ref, isInView } = useInView<HTMLElement>(0.1, 'FeaturedProducts');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const { showToast } = useToast();
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

  const handleAddToCart = async () => {
    if (selectedProduct) {
      // Check if user is signed in first
      if (!user) {
        showToast('Please sign in to add items to cart', 'info');
        setTimeout(() => {
          router.push('/sign-in')
        })
        return;
      }
      
      try {
        // Show yellow toast
        showToast(`${selectedProduct.name} is being added to cart`, 'pending');
        
        // Call API to persist to database
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            quantity,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to add item to cart');
        }

        // Update local cart state
        addItem(selectedProduct, quantity);
        
        // Show green toast on success
        showToast(`${selectedProduct.name} has been added to cart`, 'success');
        
        setSelectedProduct(null);
        setQuantity(1);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
        showToast(`Error: ${errorMessage}`, 'error');
      }
    }
  };

  return (
    <>
      <section ref={ref} className={`w-full px-4 md:px-12 py-16 bg-background transition-all duration-1000  ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Featured Products</h2>

          {loading ? (
            <div className="flex -ml-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative flex-none w-full md:w-1/2 lg:w-1/3 pl-4">
                  <div className="rounded-3xl overflow-hidden bg-white">
                    <div className="relative w-full pb-[100%] bg-gray-200 rounded-3xl animate-pulse" />
                    <div className="p-4 bg-white">
                      <div className="h-5 bg-gray-200 rounded animate-pulse mx-auto w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
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
                      <div className="group rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-900 bg-white">
                        {/* Product Image */}
                        <div className="relative w-full pb-[100%] bg-gray-100 overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="absolute inset-0 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>

                        {/* Product Name */}
                        <div className="p-4 bg-white">
                          <h3 className="text-lg font-bold text-foreground text-center line-clamp-2">
                            {product.name}
                          </h3>
                        </div>
                        <p className="text-xl text-center text-foreground" >
                          ${product.price.toLocaleString('en-US', {})}
                        </p>
                        <p className="text-2xl text-center bg-black text-white rounded-lg py-2 px-1" >See More</p>
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
          )}
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

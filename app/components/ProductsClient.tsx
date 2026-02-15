"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import CategorySidebar from './CategorySidebar';
import ProductGrid from './ProductGrid';
import ProductModal from './ProductModal';
import { Product, Category } from '../types';

interface ProductsClientProps {
  initialCategories: Category[];
  initialProducts: Product[];
}

export default function ProductsClient({ initialCategories, initialProducts }: ProductsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [carouselPosition, setCarouselPosition] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Auto-rotate carousel every 5 seconds (only when no category is selected)
  useEffect(() => {
    if (selectedCategory) {
      return; // Don't auto-rotate when a category is selected
    }
    
    const interval = setInterval(() => {
      setCarouselPosition((prev) => (prev + 1) % initialCategories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [initialCategories.length, selectedCategory]);

  // Get the 3 visible categories (prev, current, next)
  const getVisibleCategories = (): Array<{ category: Category; position: 'left' | 'center' | 'right' }> => {
    const length = initialCategories.length;
    const prevIndex = (carouselPosition - 1 + length) % length;
    const nextIndex = (carouselPosition + 1) % length;
    
    return [
      { category: initialCategories[prevIndex], position: 'left' },
      { category: initialCategories[carouselPosition], position: 'center' },
      { category: initialCategories[nextIndex], position: 'right' },
    ];
  };

  const handleCarouselNav = (direction: 'left' | 'right') => {
    const length = initialCategories.length;
    const newPosition = direction === 'left' 
      ? (carouselPosition - 1 + length) % length 
      : (carouselPosition + 1) % length;
    
    setCarouselPosition(newPosition);
    // Set the category so sidebar highlights it
    setSelectedCategory(initialCategories[newPosition].id);
  };

  const handleCategoryClick = (position: 'left' | 'center' | 'right') => {
    const length = initialCategories.length;
    let newPosition = carouselPosition;

    if (position === 'left') {
      newPosition = (carouselPosition - 1 + length) % length;
    } else if (position === 'right') {
      newPosition = (carouselPosition + 1) % length;
    }

    setCarouselPosition(newPosition);
    setSelectedCategory(initialCategories[newPosition].id);
  };

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndValue = e.changedTouches[0].clientX;
    
    if (touchStart !== null) {
      const distance = touchStart - touchEndValue;
      const isLeftSwipe = distance > 50; // Swipe left = next category
      const isRightSwipe = distance < -50; // Swipe right = prev category

      if (isLeftSwipe || isRightSwipe) {
        const length = initialCategories.length;
        const direction = isLeftSwipe ? 'right' : 'left';
        const newPosition = direction === 'left' 
          ? (carouselPosition - 1 + length) % length 
          : (carouselPosition + 1) % length;
        
        setCarouselPosition(newPosition);
        setSelectedCategory(initialCategories[newPosition].id);
      }
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleCarouselNav_OLD = (direction: 'left' | 'right') => {
    const length = initialCategories.length;
    setCarouselPosition((prev) => {
      if (direction === 'left') {
        return (prev - 1 + length) % length;
      } else {
        return (prev + 1) % length;
      }
    });
    setSelectedCategory(''); // Reset category selection
  };

  // Use server data as initial state, only refetch when category changes
  const { data: products = initialProducts, isLoading } = useSWR<Product[]>(
    selectedCategory ? `/api/products?categoryId=${selectedCategory}` : null,
    fetcher,
    { revalidateOnFocus: false, fallbackData: initialProducts }
  );

  const filteredProducts = selectedCategory
    ? products.filter(p => p.categoryId === selectedCategory)
    : products;

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      console.log(`Added ${quantity} of ${selectedProduct.name} to cart`);
      setSelectedProduct(null);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    const index = initialCategories.findIndex((cat) => cat.id === categoryId);
    if (index !== -1) {
      setCarouselPosition(index);
    }
    setSelectedCategory(categoryId);
    setIsMobileSidebarOpen(false);
  };

  return (
    <main className="flex min-h-screen bg-[#FAF8F3] flex-col lg:flex-row">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-40 bg-[#7d3d23] text-white p-2 rounded-lg shadow-lg"
      >
        {isMobileSidebarOpen ? '✕ Close' : '☰ Filters'}
      </button>

      {/* Sidebar - Desktop & Mobile */}
      <div
        className={`${
          isMobileSidebarOpen ? 'block' : 'hidden'
        } lg:block fixed lg:static inset-0 lg:inset-auto lg:z-auto z-30 bg-white lg:bg-transparent lg:w-80 lg:border-r lg:border-gray-200 pt-24 lg:pt-0 mt-16 lg:mt-0`}
      >
        <CategorySidebar
          categories={initialCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 lg:hidden z-20 mt-16"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 w-full">
        {/* Category Carousel Banner - Cover Flow */}
        <div 
          className="relative w-full h-[46rem] bg-black overflow-hidden mb-8 sm:mt-6 lg:mt-8 cursor-grab active:cursor-grabbing" 
          style={{ perspective: '1000px' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carousel Container */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Left Arrow */}
            <button
              onClick={() => handleCarouselNav('left')}
              className="absolute left-4 sm:left-8 z-40 bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 rounded-full transition-all duration-300"
              aria-label="Previous category"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Carousel Slides */}
            <div className="absolute inset-0 flex items-center justify-center">
              {getVisibleCategories().map(({ category, position }, idx) => {
                let scale = 0.7;
                let opacity = 0.6;
                let zIndex = 10;
                let rotateY = 0;
                let translateX = 0;

                if (position === 'center') {
                  scale = 1;
                  opacity = 1;
                  zIndex = 30;
                  rotateY = 0;
                } else if (position === 'left') {
                  scale = 0.75;
                  opacity = 0.5;
                  zIndex = 20;
                  rotateY = 35;
                  translateX = -60;
                } else {
                  scale = 0.75;
                  opacity = 0.5;
                  zIndex = 20;
                  rotateY = -35;
                  translateX = 60;
                }

                return (
                  <div
                    key={category.id}
                    className="absolute h-full w-1/2 transition-all duration-500 ease-out cursor-pointer hover:opacity-100"
                    onClick={() => handleCategoryClick(position)}
                    style={{
                      transform: `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`,
                      opacity: opacity,
                      zIndex: zIndex,
                    }}
                  >
                    {/* Image Container with faster animation */}
                    <div className="relative w-full h-full transition-all duration-300 ease-out">
                      <Image
                        src={category.image || '/placeholder.jpg'}
                        alt={category.name}
                        fill
                        className="object-cover object-top"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.jpg';
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Center Overlay (Text + Overlay) */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-50 pointer-events-none transition-all duration-700 ease-out">
              {initialCategories[carouselPosition] && (
                <>
                  <div className="absolute inset-0 bg-black/40"></div>
                  <h2 className="relative text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
                    {initialCategories[carouselPosition].name}
                  </h2>
                  <p className="relative text-base sm:text-lg text-white max-w-2xl">
                    {initialCategories[carouselPosition].description}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => handleCarouselNav('right')}
            className="absolute right-4 sm:right-8 z-40 bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 rounded-full transition-all duration-300 top-1/2 -translate-y-1/2"
            aria-label="Next category"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel Navigation Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-40">
            {initialCategories.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCarouselPosition(index);
                  setSelectedCategory('');
                }}
                className={`h-2 rounded-full transition-all ${
                  index === carouselPosition ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/75'
                }`}
                aria-label={`Go to category ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">

          {/* Products Grid with Loading State */}
          {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg animate-pulse">
                <div className="h-48 sm:h-56 lg:h-64 bg-gray-200"></div>
                <div className="p-3 sm:p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ProductGrid products={filteredProducts} onProductClick={handleProductClick} />
        )}
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          quantity={quantity}
          onQuantityChange={handleQuantityChange}
          onAddToCart={handleAddToCart}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}

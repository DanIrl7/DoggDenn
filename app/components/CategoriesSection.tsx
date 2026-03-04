'use client'

import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useInView } from '@/app/hooks/useInView';
import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

const CategoriesSection = () => {
  const { ref, isInView } = useInView<HTMLElement>(0.1, 'CategoriesSection');
  const { data, isLoading, error } = useSWR<Category[]>('/api/categories', fetcher);
  const [carouselPosition, setCarouselPosition] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Ensure data is an array before using .slice()
  const categories = Array.isArray(data) ? data : [];

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (categories.length === 0) return;
    
    const interval = setInterval(() => {
      setCarouselPosition((prev) => (prev + 1) % categories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [categories.length]);

  // Get the 3 visible categories (prev, current, next)
  const getVisibleCategories = (): Array<{ category: Category; position: 'left' | 'center' | 'right' }> => {
    if (categories.length === 0) return [];
    
    const length = categories.length;
    const prevIndex = (carouselPosition - 1 + length) % length;
    const nextIndex = (carouselPosition + 1) % length;
    
    return [
      { category: categories[prevIndex], position: 'left' },
      { category: categories[carouselPosition], position: 'center' },
      { category: categories[nextIndex], position: 'right' },
    ];
  };

  const handleCarouselNav = (direction: 'left' | 'right') => {
    const length = categories.length;
    const newPosition = direction === 'left' 
      ? (carouselPosition - 1 + length) % length 
      : (carouselPosition + 1) % length;
    
    setCarouselPosition(newPosition);
  };

  const handleCategoryClick = (position: 'left' | 'center' | 'right') => {
    const length = categories.length;
    let newPosition = carouselPosition;

    if (position === 'left') {
      newPosition = (carouselPosition - 1 + length) % length;
    } else if (position === 'right') {
      newPosition = (carouselPosition + 1) % length;
    }

    setCarouselPosition(newPosition);
  };

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEndValue = e.changedTouches[0].clientX;
    const distance = touchStart - touchEndValue;
    const isLeftSwipe = distance > 50; // Swipe left = next category
    const isRightSwipe = distance < -50; // Swipe right = prev category

    if (isLeftSwipe || isRightSwipe) {
      const length = categories.length;
      const direction = isLeftSwipe ? 'right' : 'left';
      const newPosition = direction === 'left' 
        ? (carouselPosition - 1 + length) % length 
        : (carouselPosition + 1) % length;
      
      setCarouselPosition(newPosition);
    }
    
    setTouchStart(null);
  };

  return (
    <section
      ref={ref}
      className={`w-full bg-background transition-all duration-1000 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {error ? (
        <div className="flex justify-center items-center h-full py-16">
          <p className="text-xl text-red-500">Failed to load categories. Please check your database connection.</p>
        </div>
      ) : isLoading ? (
        <div className="w-full h-[30rem] sm:h-80 md:h-96 lg:h-[46rem] bg-gray-200 animate-pulse" />
      ) : categories.length === 0 ? (
        <div className="flex justify-center items-center h-full py-16">
          <div className="text-center">
            <p className="text-xl text-gray-500 mb-4">No categories available yet.</p>
            <Link href="/admin-dashboard" className="text-(--primary) hover:underline">
              Add categories in admin panel
            </Link>
          </div>
        </div>
      ) : (
        <div 
          className="relative w-full h-[30rem] sm:h-80 md:h-96 lg:h-[46rem] bg-black overflow-hidden cursor-grab active:cursor-grabbing" 
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
              {getVisibleCategories().map(({ category, position }) => {
                // Responsive scale values
                const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                
                let scale = isMobile ? 0.75 : 0.7;
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
                  scale = isMobile ? 0.65 : 0.75;
                  opacity = 0.3;
                  zIndex = 20;
                  rotateY = 35;
                  translateX = isMobile ? -35 : -60;
                } else {
                  scale = isMobile ? 0.65 : 0.75;
                  opacity = 0.3;
                  zIndex = 20;
                  rotateY = -35;
                  translateX = isMobile ? 35 : 60;
                }

                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.id}`}
                    className="absolute h-full w-4/5 transition-all duration-500 ease-out cursor-pointer hover:opacity-100"
                    onClick={(e) => {
                      if (position !== 'center') {
                        e.preventDefault();
                        handleCategoryClick(position);
                      }
                    }}
                    style={{
                      transform: `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`,
                      opacity: opacity,
                      zIndex: zIndex,
                    }}
                  >
                    {/* Image Container */}
                    <div className="relative w-full h-full transition-all duration-300 ease-out">
                      <Image
                        src={category.image || '/placeholder.jpg'}
                        alt={category.name}
                        fill
                        className="object-contain object-top"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Center Overlay (Text + Overlay) */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-50 pointer-events-none transition-all duration-700 ease-out">
              {categories[carouselPosition] && (
                <>
                  <div className="absolute inset-0 bg-black/40"></div>
                  <h2 className="relative text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 px-2 line-clamp-2">
                    {categories[carouselPosition].name}
                  </h2>
                  <p className="relative text-xs sm:text-sm md:text-base lg:text-lg text-white max-w-xl px-2 line-clamp-3 hidden sm:block">
                    {categories[carouselPosition].description}
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
          <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex justify-center gap-1.5 sm:gap-2 z-40">
            {categories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCarouselPosition(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all ${
                  index === carouselPosition ? 'bg-white w-6 sm:w-8' : 'bg-white/50 w-1.5 sm:w-2 hover:bg-white/75'
                }`}
                aria-label={`Go to category ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default CategoriesSection;
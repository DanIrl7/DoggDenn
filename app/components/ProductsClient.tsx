"use client"

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import useSWR from 'swr';
import useEmblaCarousel from 'embla-carousel-react';
import { fetcher } from '@/lib/fetcher';
import { useToast } from './ToastProvider';
import { useCartStore } from '@/app/store/cartStore';
import CategorySidebar from './CategorySidebar';
import ProductGrid from './ProductGrid';
import ProductModal from './ProductModal';
import { Product, Category } from '../types';

interface ProductsClientProps {
  initialCategories: Category[];
  initialProducts: Product[];
}

export default function ProductsClient({ initialCategories, initialProducts }: ProductsClientProps) {
  const router = useRouter();
  const { user } = useUser();
  const { showToast } = useToast();
  const { addItem } = useCartStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [selectedSnap, setSelectedSnap] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'center',
      loop: true,
      slidesToScroll: 1,
    },
    []
  );

  // Initialize carousel
  useEffect(() => {
    if (!emblaApi) return;
    
    setCarouselApi(emblaApi);
  }, [emblaApi]);

  // Auto-rotate carousel
  useEffect(() => {
    if (!carouselApi || !isAutoRotating || selectedCategory) {
      return;
    }

    const autoScroll = setInterval(() => {
      carouselApi.scrollNext();
    }, 5000);

    return () => clearInterval(autoScroll);
  }, [carouselApi, isAutoRotating, selectedCategory]);

  // Handle scroll changes
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setSelectedSnap(carouselApi.selectedScrollSnap());
    };

    carouselApi.on('select', onSelect);
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi]);

  // Scroll carousel to selected category
  useEffect(() => {
    if (!carouselApi || !selectedCategory) return;

    const categoryIndex = initialCategories.findIndex(c => c.id === selectedCategory);
    if (categoryIndex !== -1) {
      carouselApi.scrollTo(categoryIndex);
    }
  }, [carouselApi, selectedCategory, initialCategories]);

  const scrollPrev = useCallback(() => {
    if (carouselApi) {
      carouselApi.scrollPrev();
      setIsAutoRotating(false);
    }
  }, [carouselApi]);

  const scrollNext = useCallback(() => {
    if (carouselApi) {
      carouselApi.scrollNext();
      setIsAutoRotating(false);
    }
  }, [carouselApi]);

  const handleGridCategoryClick = (category: Category) => {
    setSelectedCategory(category.id);
    setIsAutoRotating(false);
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

  const handleProductClick = (product: Product, qty: number = 1) => {
    setSelectedProduct(product);
    setQuantity(qty);
  };

  const handleAddToCart = async () => {
    if (selectedProduct) {
      // Check if user is signed in first
      if (!user) {
        showToast('Please sign in to add items to cart', 'info');
        router.push('/sign-in');
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
            image: selectedProduct.image || selectedProduct.images?.[0] || null,
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

  const handleDirectAddToCart = async (product: Product, qty: number) => {
    // Check if user is signed in first
    if (!user) {
      showToast('Please sign in to add items to cart', 'info');
      router.push('/sign-in');
      return;
    }

    try {
      // Show yellow toast
      showToast(`${product.name} is being added to cart`, 'pending');
      
      // Call API to persist to database
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: qty,
          image: product.image || product.images?.[0] || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add item to cart');
      }

      // Update local cart state
      addItem(product, qty);
      
      // Show green toast on success
      showToast(`${product.name} has been added to cart`, 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
      showToast(`Error: ${errorMessage}`, 'error');
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsAutoRotating(false);
    setIsMobileSidebarOpen(false);
  };

  return (
    <main className="flex min-h-screen bg-background flex-col lg:flex-row">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-40 bg-white text-primary-foreground p-2 rounded-lg shadow-lg"
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
      {/* Category Grid Banner */}
        <div className="relative w-full bg-black px-4 sm:px-6 lg:px-8 py-8 mb-8 sm:mt-6 lg:mt-8">
          {/* Grid Container */}
          <div className="max-w-7xl mx-auto">
            {/* Category Name and Description */}
            <div className="mb-6 text-white h-32 sm:h-36 flex flex-col justify-between">
              {selectedCategory && initialCategories.find(c => c.id === selectedCategory) ? (
                <>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 line-clamp-2">
                    {initialCategories.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-base sm:text-lg text-white/80 line-clamp-2">
                    {initialCategories.find(c => c.id === selectedCategory)?.description || 'No description available'}
                  </p>
                </>
              ) : initialCategories[selectedSnap] ? (
                <>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 line-clamp-2">
                    {initialCategories[selectedSnap]?.name}
                  </h2>
                  <p className="text-base sm:text-lg text-white/80 line-clamp-2">
                    {initialCategories[selectedSnap]?.description || 'No description available'}
                  </p>
                </>
              ) : null}
            </div>

            {/* Carousel Container */}
            <div className="flex items-center gap-4">
              {/* Left Arrow */}
              <button
                onClick={scrollPrev}
                className="flex-shrink-0 bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 rounded-full transition-all duration-300"
                aria-label="Previous categories"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Embla Carousel */}
              <div className="flex-1 overflow-hidden" ref={emblaRef}>
                <div className="flex gap-8 px-8">
                  {initialCategories.map((category) => (
                    <div 
                      key={category.id} 
                      className={`transition-all duration-300 ${
                        selectedCategory === category.id || initialCategories[selectedSnap]?.id === category.id
                          ? 'flex-[0_0_100%] sm:flex-[0_0_calc(50%-2rem)] lg:flex-[0_0_calc(45%-5rem)]'
                          : 'flex-[0_0_100%] sm:flex-[0_0_calc(50%-2rem)] lg:flex-[0_0_calc(33.333%-2rem)]'
                      }`}
                    >
                      <button
                        onClick={() => handleGridCategoryClick(category)}
                        className={`w-full relative overflow-hidden rounded-lg h-56 sm:h-64 transition-all duration-300 ${
                          selectedCategory === category.id || initialCategories[selectedSnap]?.id === category.id
                            ? 'ring-8 ring-[#ffffff20] shadow-2xl'
                            : 'opacity-75 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={category.image || '/placeholder.jpg'}
                          alt={category.name}
                          fill
                          className="object-cover hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white font-bold text-center px-2">{category.name}</p>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Arrow */}
              <button
                onClick={scrollNext}
                className="flex-shrink-0 bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 rounded-full transition-all duration-300"
                aria-label="Next categories"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
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
          <ProductGrid 
            products={filteredProducts} 
            onProductClick={handleProductClick}
            onDirectAddToCart={handleDirectAddToCart}
          />
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

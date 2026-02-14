"use client"

import { useState } from 'react';
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
    setSelectedCategory(categoryId);
    setIsMobileSidebarOpen(false);
  };

  return (
    <main className="flex min-h-screen bg-gray-50 flex-col lg:flex-row">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-40 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
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
      <div className="flex-1 w-full p-4 sm:p-6 lg:p-8">
        {/* Category Tabs - Mobile Dropdown & Desktop Scroll */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="lg:hidden w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium mb-4"
          >
            <option value="">All Products</option>
            {initialCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Desktop Horizontal Tabs */}
          <div className="hidden lg:block overflow-x-auto">
            <div className="flex gap-3 pb-4">
              <button
                onClick={() => setSelectedCategory('')}
                disabled={isLoading}
                className={`px-4 sm:px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all text-sm sm:text-base flex items-center gap-2 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                } ${
                  selectedCategory === ''
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {isLoading && selectedCategory === '' && (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                All Products
              </button>
              {initialCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  disabled={isLoading}
                  className={`px-4 sm:px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all text-sm sm:text-base flex items-center gap-2 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  } ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {isLoading && selectedCategory === category.id && (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

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

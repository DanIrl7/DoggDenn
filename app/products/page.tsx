"use client"

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import CategorySidebar from '../components/CategorySidebar';
import ProductGrid from '../components/ProductGrid';
import ProductModal from '../components/ProductModal';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
}

export default function ProductsPage() {
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialCategory = searchParams?.get('category') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { data: categories } = useSWR<Category[]>('/api/categories', fetcher);
  const { data: products } = useSWR<Product[]>(
    selectedCategory ? `/api/products?categoryId=${selectedCategory}` : '/api/products',
    fetcher
  );

  const categoriesList = Array.isArray(categories) ? categories : [];
  const productsList = Array.isArray(products) ? products : [];

  const filteredProducts = selectedCategory
    ? productsList.filter(p => p.categoryId === selectedCategory)
    : productsList;

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      console.log(`Added ${quantity} of ${selectedProduct.name} to cart`);
      // TODO: Implement actual cart functionality
      setSelectedProduct(null);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  return (
    <main className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <CategorySidebar
        categories={categoriesList}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Category Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-4 pb-4">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              All Products
            </button>
            {categoriesList.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid products={filteredProducts} onProductClick={handleProductClick} />
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
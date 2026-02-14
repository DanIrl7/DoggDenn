'use client'

import Image from 'next/image';
import { Category } from '../types';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategorySidebar = ({ categories, selectedCategory, onSelectCategory }: CategorySidebarProps) => {
  const highlightedCategory = categories.find(cat => cat.id === selectedCategory);

  return (
    <aside className="w-full lg:w-80 bg-white p-4 sm:p-6 lg:border-r lg:border-gray-200">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Categories</h2>

      {/* Highlighted Category */}
      {highlightedCategory && (
        <div className="mb-6 sm:mb-8 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="relative h-40 sm:h-48 w-full mb-4 rounded-lg overflow-hidden">
            <Image
              src={highlightedCategory.image || '/placeholder.jpg'}
              alt={highlightedCategory.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{highlightedCategory.name}</h3>
          <p className="text-xs sm:text-sm text-gray-600">{highlightedCategory.description}</p>
        </div>
      )}

      {/* Category List */}
      <div className="space-y-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`w-full text-left px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default CategorySidebar;

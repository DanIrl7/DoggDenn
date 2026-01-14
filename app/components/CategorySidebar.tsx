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
    <aside className="w-80 bg-white p-6 border-r border-gray-200 hidden lg:block">
      <h2 className="text-2xl font-bold mb-6">Categories</h2>

      {/* Highlighted Category */}
      {highlightedCategory && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
            <Image
              src={highlightedCategory.image || '/placeholder.jpg'}
              alt={highlightedCategory.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{highlightedCategory.name}</h3>
          <p className="text-sm text-gray-600">{highlightedCategory.description}</p>
        </div>
      )}

      {/* Category List */}
      <div className="space-y-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
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

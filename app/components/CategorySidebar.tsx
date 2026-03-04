'use client'

import { Category } from '../types';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategorySidebar = ({ categories, selectedCategory, onSelectCategory }: CategorySidebarProps) => {
  return (
    <aside className="w-full lg:w-80 bg-white p-4 sm:p-6 lg:border-r lg:border-gray-200">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Categories</h2>

      {/* Category List */}
      <div className="space-y-2">
        <button
          onClick={() => onSelectCategory('')}
          className={`w-full text-left px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
            selectedCategory === ''
              ? 'bg-primary text-primary-foreground'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Products
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`w-full text-left px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground'
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

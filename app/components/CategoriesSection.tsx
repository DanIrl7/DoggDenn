'use client'

import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

const CategoriesSection = () => {
  const { data, isLoading, error } = useSWR<Category[]>('/api/categories', fetcher);

  // Ensure data is an array before using .slice()
  const categories = Array.isArray(data) ? data : [];
  const displayCategories = categories.slice(0, 3);

  if (error) {
    console.error('Error loading categories:', error);
    return (
      <section className="w-full py-16">
        <div className="flex justify-center items-center h-full">
          <p className="text-xl text-red-500">Failed to load categories. Please check your database connection.</p>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="w-full px-4 md:px-12 py-8">
        <div className="flex flex-col justify-evenly md:flex-row gap-4">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="flex flex-col h-[720px] w-[500px] md:flex-1 rounded-lg"
            >
              <div className="overflow-hidden rounded-lg h-[712px] w-[449px] bg-gray-200 animate-pulse">
                <div className="h-full w-full blur-sm bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300" />
              </div>
              <div className="mt-3 h-7 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (displayCategories.length === 0) {
    return (
      <section className="w-full py-16">
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <p className="text-xl text-gray-500 mb-4">No categories available yet.</p>
            <Link href="/admin-dashboard" className="text-(--primary) hover:underline">
              Add categories in admin panel
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 md:px-12 py-8 bg-[#FAF8F3]">
      <style>{`
        @keyframes zoomLoop {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .zoom-loop {
          animation: zoomLoop 15s ease-in-out infinite;
        }
      `}</style>
      <div className="flex flex-col justify-evenly md:flex-row gap-4">
        {displayCategories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.id}`}
            className="group flex flex-col h-[720px] w-[500px] md:flex-1 rounded-lg"
          >
            <div className="overflow-hidden rounded-lg h-[712px] w-full">
              <Image
                src={category.image || '/placeholder.jpg'}
                alt={category.name}
                width={449}
                height={712}
                style={{ objectFit: 'cover'}}
                sizes="(max-width: 768px) 449px, 33vw"
                className="h-full w-full zoom-loop transition-transform duration-400 group-hover:scale-110"
                onError={(e) => {
                  console.error(`Failed to load image for ${category.name}:`, category.image);
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.jpg';
                }}
              />
            </div>
            
            {/* Bottom Text */}
            <h3 className="text-xl font-bold text-black mb-3">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
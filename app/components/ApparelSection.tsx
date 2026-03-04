'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useInView } from '@/app/hooks/useInView';
import { useParallax } from '@/app/hooks/useParallax';

export default function ApparelSection() {
  const { ref, isInView } = useInView<HTMLElement>();
  const parallaxRef = useParallax(0.3);

  return (
    <section
      ref={ref}
      className="w-full relative md:min-h-screen flex md:items-center md:justify-center md:p-4 sm:md:p-6 md:md:p-8 overflow-hidden flex-col md:flex-row"
    >
      {/* Background Image - Absolute on desktop, relative on mobile */}
      <div
        ref={parallaxRef}
        className="md:absolute inset-0 w-full h-auto md:h-full"
      >
        <Image
          src="/Frosty.jpg"
          alt="Happy dog playing in winter snow"
          fill
          quality={100}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Mobile Layout - Image on top */}
      <div className="md:hidden w-full h-64 sm:h-80 relative flex-shrink-0">
        <Image
          src="/Frosty.jpg"
          alt="Happy dog playing in winter snow"
          fill
          quality={100}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Text Content - Mobile: Black background below image, Desktop: Overlay */}
      <div
        className={`relative md:absolute w-full md:w-auto md:max-w-3xl z-10 text-white text-left p-4 sm:p-6 md:p-8 md:rounded-lg transition-all duration-700 flex flex-col justify-center py-8 md:py-0 bg-black/90 md:bg-transparent ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6">
          Winter Adventures Await.
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium mb-4 sm:mb-6 md:mb-8 leading-relaxed">
          Keep your furry friend warm and comfortable during those chilly winter months. Our premium winter collection features durable gear, cozy beds, and protective apparel designed to keep your dog happy and healthy in any weather.
        </p>
        <Link
          href="/products?category=apparel"
          className="inline-block border-2 border-white text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base transition duration-300 hover:bg-white hover:text-black w-fit"
        >
          Shop Winter Collection
        </Link>
      </div>
    </section>
  );
}

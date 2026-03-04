'use client'
import Image from "next/image";
import Link from "next/link";
import CategoriesSection from './components/CategoriesSection';
import TestimonialsSection from './components/TestimonialsSection';
import FeaturesSection from './components/FeaturesSection';
import FeaturedProducts from './components/FeaturedProducts';
import ApparelSection from './components/ApparelSection';
import { useInView } from '@/app/hooks/useInView';
import { useParallax } from '@/app/hooks/useParallax';

export default function Home() {

const { ref, isInView } = useInView<HTMLElement>();
const parallaxRef = useParallax(0.3)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background">
    {/* HERO SECTION */}
    <section ref={ref} className="relative w-full md:min-h-screen md:h-full flex md:items-center md:justify-start text-center overflow-hidden flex-col md:flex-row">

      <div
        ref={parallaxRef}
        className="md:absolute inset-0 w-full h-auto md:h-full"
      >
        <Image
          src="/hero1/hero1.webp"
          alt="Doggdenn hero Image"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Mobile Layout - Image on top */}
      <div className="md:hidden w-full h-64 sm:h-80 relative flex-shrink-0">
        <Image
          src="/hero1/hero1.webp"
          alt="Doggdenn hero Image"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Text Section - Mobile: Black background below image, Desktop: Overlay */}
      <div className={`relative md:absolute md:justify-self-start w-full md:w-auto md:max-w-4xl z-10 text-white p-4 sm:p-6 md:p-8 md:rounded-lg md:mx-4 transition-all duration-700 flex flex-col justify-center py-8 md:py-0 bg-black/90 md:bg-transparent ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
        <h1 className="text-2xl/[2] sm:text-4xl md:text-5xl/[2] lg:text-6xl/[2] font-extrabold mb-3 sm:mb-4">
          Everything Your Dog Needs to Feel at Home
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8">
          Your one-stop shop for premium pet products.
        </p>
        <Link href="/products" className="inline-block bg-amber-600 border-2 border-amber-600 hover:bg-transparent hover:border-amber-600 hover:text-amber-600 hover:border-2 text-primary-foreground font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base duration-300 w-fit">
          Shop Later
        </Link>
      </div>

      {/* Scroll cue - Desktop only */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-1 text-white opacity-80">
        <span className="text-sm tracking-widest uppercase">Scroll</span>
        <svg
          className="w-6 h-6 animate-bounce"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>

    
<CategoriesSection />

    <ApparelSection />

    <FeaturedProducts />

    <FeaturesSection />

    <TestimonialsSection />

    </main>
  );
}

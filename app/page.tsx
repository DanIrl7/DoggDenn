'use client';

import Image from 'next/image';
import Link from 'next/link';
import CategoriesSection from './components/CategoriesSection';
import TestimonialsSection from './components/TestimonialsSection';
import FeaturesSection from './components/FeaturesSection';
import FeaturedProducts from './components/FeaturedProducts';
import ApparelSection from './components/ApparelSection';
import { Parallax } from 'react-scroll-parallax';

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#FED7AA" offset="20%" />
      <stop stop-color="#FEF3C7" offset="50%" />
      <stop stop-color="#FED7AA" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#FED7AA"/>
  <rect id="r" width="${w}" height="${h}" fill="url(#g)"/>
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

const heroBlurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(800, 600))}`;

export default function Home() {
  // const { ref: desktopBgRef } = useParallax<HTMLDivElement>({ speed: -20 });
  // const { ref: mobileBgRef } = useParallax<HTMLDivElement>({ speed: -12 });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background">
      {/* HERO SECTION */}
      <section className="relative w-full md:h-screen flex md:items-center md:justify-start text-center overflow-hidden flex-col md:flex-row">
        {/* Background Image (mobile: takes space; desktop: absolute overlay) */}
        <div className="relative w-full h-64 sm:h-96 md:absolute md:inset-0 md:h-full overflow-hidden bg-[#FED7AA]">
          <Parallax speed={-15} className="absolute inset-0 will-change-transform md:hidden">
            <div className="absolute -inset-12 scale-110">
            <Image
              src="/hero1/hero1.webp"
              alt="Doggdenn hero Image"
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={heroBlurDataURL}
              className="object-cover"
            />
            </div>
           </Parallax>

          <Parallax className="absolute inset-0 will-change-transform hidden md:block">
            <Image
              src="/hero1/hero1.webp"
              alt="Doggdenn hero Image"
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={heroBlurDataURL}
              className="object-cover"
            />
          </Parallax>
        </div>

        {/* Text Section - Mobile: Black background below image, Desktop: Overlay */}
        <div className="relative md:absolute md:justify-self-start w-full md:w-auto md:max-w-4xl z-10 text-white p-4 sm:p-6 md:p-8 md:rounded-lg md:mx-4 transition-all duration-700 flex flex-col justify-center py-8 md:py-0 bg-black/90 md:bg-transparent">
          <h1 className="text-2xl/[2] sm:text-4xl md:text-5xl/[2] lg:text-6xl/[2] font-extrabold mb-3 sm:mb-4">
            Everything Your Dog Needs to Feel at Home
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8">
            Your one-stop shop for premium pet products.
          </p>
          <Link
            href="/products"
            className="inline-block bg-amber-600 border-2 border-amber-600 hover:bg-transparent hover:border-amber-600 hover:text-amber-600 hover:border-2 text-primary-foreground font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base duration-300 w-fit"
          >
            Shop Now
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

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useInView } from '@/app/hooks/useInView';
import { useParallax } from 'react-scroll-parallax';

export default function ApparelSection() {
  const { ref, isInView } = useInView<HTMLElement>();
  const { ref: desktopBgRef } = useParallax<HTMLDivElement>({ speed: -18 });
  const { ref: mobileBgRef } = useParallax<HTMLDivElement>({ speed: -10 });

  return (
    <section
      ref={ref}
      className="w-full relative md:min-h-screen flex md:items-center md:justify-center md:p-4 overflow-hidden flex-col md:flex-row"
    >
      {/* Background Image (mobile: takes space; desktop: absolute overlay) */}
      <div className="relative w-full h-64 sm:h-80 md:absolute md:inset-0 md:h-full overflow-hidden">
        <div ref={mobileBgRef} className="absolute inset-0 will-change-transform md:hidden">
          <div className="absolute scale-110 -inset-10">
          <Image
            src="/Frosty.jpg"
            alt="Happy dog playing in winter snow"
            fill
            quality={100}
            sizes="100vw"
            className="object-cover"
          />
          </div>
        </div>

        <div ref={desktopBgRef} className="absolute inset-0 will-change-transform hidden md:block">
          <Image
            src="/Frosty.jpg"
            alt="Happy dog playing in winter snow"
            fill
            quality={100}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Text Content - Mobile: Black background below image, Desktop: Overlay */}
      <div
        className={`relative md:absolute w-full md:w-auto md:max-w-3xl z-10 text-white text-left sm:p-6 md:p-8 md:rounded-lg transition-all duration-700 flex flex-col justify-center p-12 bg-[#000000b6] ${
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

'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { type EmblaOptionsType } from 'embla-carousel';
import Image from 'next/image';

type CarouselProps = {
  images: { src: string; alt: string }[];
  options?: EmblaOptionsType;
};

export default function Carousel({ images, options }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative w-full max-w-[96rem] mx-auto">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex -ml-4">
          {images.map((image, index) => (
            <div
              className="relative flex-none w-full md:w-1/2 lg:w-1/3 pl-4"
              key={index}
            >
              {/* Image Container with Fixed Aspect Ratio - 25% smaller */}
              <div className="relative w-full pb-[80%]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  objectFit='contain'
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="absolute object-contain inset-0 h-full rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons - 25% smaller */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-3 shadow-md hover:bg-opacity-90 transition-opacity duration-200"
        onClick={scrollPrev}
        aria-label="Previous slide"
      >
        <svg className="w-9 h-9 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-3 shadow-md hover:bg-opacity-90 transition-opacity duration-200"
        onClick={scrollNext}
        aria-label="Next slide"
      >
        <svg className="w-9 h-9 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
  );
}
import Image from "next/image";
import Link from "next/link";
import CategoriesSection from './components/CategoriesSection';
import TestimonialsSection from './components/TestimonialsSection';
import FeaturesSection from './components/FeaturesSection';
import FeaturedProducts from './components/FeaturedProducts';

export default function Home() {

  return (
   <main className="flex min-h-screen flex-col items-center justify-between bg-[#FAF8F3]"> 

    {/* HERO SECTION */}
    <section className="relative w-full min-h-screen flex items-center justify-center text-center">

      <Image
        src="/hero1/hero1.webp"
        alt="Doggdenn hero Image"
        fill
        priority
        className="object-cover -z-10"
      />
      <div className="relative text-white bg-[#00000053] p-4 sm:p-6 md:p-8 rounded-lg max-w-xs sm:max-w-lg md:max-w-2xl mx-4">
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4">
          Welcome to Doggdenn!
        </h1>
        <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
          Your one-stop shop for premium pet products.
        </p>
        <Link href="/products" className="inline-block bg-[#7d3d23] hover:bg-[#6a3320] text-white hover:text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base transition duration-400">
          Shop Now
        </Link>
      </div>
    </section>

    <FeaturedProducts />

    { /*APPAREL SECTION */ }

    <section className="relative w-full min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <Image
        src="/Frosty.jpg"
        alt="Happy dog playing in winter snow"
        fill
        className="object-cover -z-10"
      />
      <div className="relative z-10 text-white bg-[#00000053] p-4 sm:p-6 md:p-8 rounded-lg max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl text-left">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6">
          Winter Adventures Await.
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium mb-4 sm:mb-6 md:mb-8 leading-relaxed">
          Keep your furry friend warm and comfortable during those chilly winter months. Our premium winter collection features durable gear, cozy beds, and protective apparel designed to keep your dog happy and healthy in any weather.
        </p>
        <Link href="/products?category=winter" className="inline-block border-2 border-white text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-base transition duration-300 hover:bg-white hover:text-[#7d3d23]">
          Shop Winter Collection
        </Link>
      </div>
    </section>

    <CategoriesSection />

    <FeaturesSection />

    <TestimonialsSection />

    </main>
  );
}

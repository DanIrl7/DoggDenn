import Image from "next/image";
import Link from "next/link";
import Carousel from './components/Carousel'
import CategoriesSection from './components/CategoriesSection';
import TestimonialsSection from './components/TestimonialsSection';
import FeaturesSection from './components/FeaturesSection';

export default function Home() {

  const carouselImages = [
    { src: '/dog-chewing-bone.jpg', alt: 'Dog Chewing Bone' },
    { src: '/dog-sunglasses.jpg', alt: 'Dog Wearing Sunglasses' },
    { src: '/paw-dog-bed.jpg', alt: 'Dog in Comfortable Bed' },
    { src: '/ball-launcher.jpg', alt: 'Automatic Ball Launcher' },
  ]

  const emblaOptions = {
    loop: true,
   slidesToScroll: 1,
  }

  return (
   <main className="flex min-h-screen flex-col items-center justify-between p-0-20"> 


    {/* HERO SECTION */}
    <section className="relative w-[95vw] h-screen md:h-screen flex items-center justify-center text-center">

      <Image
      src= '/hero1/hero1.webp'
      alt="Doggdenn hero Image"
      layout="fill"
      objectFit="cover"
      quality={100}
      className="z-0"
      />
        <div className="transparent-background relative text-white bg-[#00000053] p-8 rounded-lg max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Welcome to Doggdenn!
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Your one-stop shop for premium pet products.
          </p>
          <Link href="/products" className="bg-()--transparent-dark) hover:bg-(--primary) text-white hover:text-white font-bold py-3 px-6 rounded-full text-lg transition duration-400">
            Shop Now
          </Link>
        </div>

      </section>

      {/* CAROUSEL SECTION */}
      <section className="w-full my-20">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        <Carousel images={carouselImages} options={emblaOptions} />
      </section>

    { /*APPAREL SECTION */ }

    <section className="relative w-full h-screen flex items-center justify-center text-center p-4">
      <Image
        src="/Frosty.jpg"
        alt="Happy dog playing in winter snow"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-0"
      />
      <div className="relative z-10 text-white p-8 rounded-lg max-w-3xl text-left bg-[#00000053]">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          Winter Adventures Await.
        </h2>
        <p className="text-lg md:text-3xl font-medium mb-8 leading-relaxed">
          Keep your furry friend warm and comfortable during those chilly winter months. Our premium winter collection features durable gear, cozy beds, and protective apparel designed to keep your dog happy and healthy in any weather.
        </p>
        <Link href="/products?category=winter" className="border-2 border-white text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 hover:bg-white hover:text-[#7d3d23]">
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

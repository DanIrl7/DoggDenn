'use client'
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-foreground to-amber-600 text-foreground py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About DoggDenn</h1>
          <p className="text-lg md:text-xl opacity-90">
            Your trusted source for premium dog products and accessories
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className=" max-w-6xl rounded-xl mx-auto bg-white">
        <div className="grid md:grid-cols-2 gap-12 items-center rounded-xl">
          <div className="px-10 py-20" >
            <h2 className="text-4xl font-bold text-foreground mb-6">Our Story</h2>
            <p className="text-foreground text-xl mb-4 leading-relaxed">
              DoggDenn was founded with a simple mission: to provide dog owners with the highest quality products
              that enhance the lives of our furry friends. We believe every dog deserves the best care, comfort, and style.
            </p>
            <p className="text-foreground text-xl leading-relaxed">
              Our carefully curated selection of products is chosen to meet the needs of dogs and their owners,
              from premium food and toys to comfortable bedding and accessories.
            </p>
          </div>
          <div className="relative w-full overflow-hidden rounded-lg bg-muted h-64 md:h-full">
        <Image
          src="/about-dog.jpg"
          alt="Happy dog with owner"
          fill
          quality={100}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-background py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-bold text-foreground mb-4">Quality</h3>
              <p className="text-gray-600">
                We only stock products that meet our strict quality standards, ensuring your dog gets the best.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-bold text-foreground mb-4">Trust</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We stand behind every product we offer.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-bold text-foreground mb-4">Care</h3>
              <p className="text-gray-600">
                We genuinely care about the wellbeing of all dogs and their happy, healthy lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#78350F] text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
        <p className="text-lg mb-8 opacity-90">
          Discover why thousands of dog owners trust DoggDenn for their pet&#39;s needs.
        </p>
        <a
          href="/products"
          className="inline-block border-2 border-white bg-white text-[#78350F] font-bold px-8 py-3 rounded-full hover:bg-[#78350F] hover:text-white transition-colors  hover:border-white duration-200"
        >
          Browse Our Products
        </a>
      </section>
    </main>
  );
}

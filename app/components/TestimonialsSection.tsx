'use client'

import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image: string;
  rating: number;
}

const TestimonialsSection = () => {
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Dog Owner',
      content: 'Doggdenn has the best selection of products for my golden retriever. The quality is exceptional and my dog absolutely loves everything we\'ve bought!',
      image: '/placeholder.jpg',
      rating: 5
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Pet Parent',
      content: 'Fast shipping, great customer service, and products that actually last. Highly recommend Doggdenn to any pet owner looking for quality items.',
      image: '/placeholder.jpg',
      rating: 5
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'Dog Enthusiast',
      content: 'My rescue dogs are so much happier with the toys and bedding from Doggdenn. The prices are reasonable and the products are durable.',
      image: '/placeholder.jpg',
      rating: 5
    },
  ];

  return (
    <section className="w-full px-4 md:px-12 py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">What Our Customers Say</h2>
        <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
          Thousands of happy pet owners trust Doggdenn for their furry friends' needs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Star Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              
              {/* Review Content */}
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              
              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

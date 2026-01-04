'use client'

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const FeaturesSection = () => {
  const features: Feature[] = [
    {
      id: '1',
      title: 'Free Shipping',
      description: 'On orders over $50. Fast and reliable delivery to your door.',
      icon: '🚚'
    },
    {
      id: '2',
      title: 'Quality Guaranteed',
      description: 'All products are carefully selected and tested for durability.',
      icon: '✓'
    },
    {
      id: '3',
      title: '30-Day Returns',
      description: 'Not satisfied? Easy returns within 30 days, no questions asked.',
      icon: '↩️'
    },
    {
      id: '4',
      title: '24/7 Support',
      description: 'Our friendly team is here to help you anytime, anywhere.',
      icon: '💬'
    },
  ];

  return (
    <section className="w-full px-4 md:px-12 py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Why Choose Doggdenn?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-gray-50 transition-colors duration-300"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

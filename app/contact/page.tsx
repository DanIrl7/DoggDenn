export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F3]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#7d3d23] to-[#a0522d] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-lg md:text-xl opacity-90">
            We&#39;d love to hear from you. Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-[#7d3d23] mb-8">Get In Touch</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#7d3d23] mb-2">Email</h3>
              <p className="text-gray-600">
                <a href="mailto:info@doggdenn.com" className="hover:text-[#7d3d23] transition-colors">
                  info@doggdenn.com
                </a>
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#7d3d23] mb-2">Phone</h3>
              <p className="text-gray-600">
                <a href="tel:+1234567890" className="hover:text-[#7d3d23] transition-colors">
                  (123) 456-7890
                </a>
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#7d3d23] mb-2">Hours</h3>
              <p className="text-gray-600">
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#7d3d23] mb-2">Follow Us</h3>
              <p className="text-gray-600">
                Find us on social media for updates and dog content!
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#7d3d23] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7d3d23]"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#7d3d23] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7d3d23]"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#7d3d23] mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7d3d23]"
                  placeholder="Subject"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#7d3d23] mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7d3d23]"
                  placeholder="Your message..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#7d3d23] text-white font-bold py-3 rounded-full hover:opacity-90 transition-opacity duration-200"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#FAF8F3] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#2C2C2C] mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-bold text-[#7d3d23] mb-2">How long does shipping take?</h3>
              <p className="text-gray-600">
                Most orders ship within 1-2 business days. Delivery typically takes 3-5 business days depending on your location.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-bold text-[#7d3d23] mb-2">Do you offer returns?</h3>
              <p className="text-gray-600">
                Yes! We offer a 30-day return policy on most items. Contact us if you&#39;re not satisfied with your purchase.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-bold text-[#7d3d23] mb-2">Are your products pet-safe?</h3>
              <p className="text-gray-600">
                Absolutely! All our products are carefully selected to ensure they&#39;re safe and beneficial for your furry friend.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

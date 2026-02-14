import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#7d3d23] text-white py-8 sm:py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">

        {/* Quick Links */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Quick Links</h3>
          <ul className="space-y-1 sm:space-y-2">
            <li>
              <Link href="/products" className="hover:text-orange-200 transition-colors text-sm sm:text-base">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-orange-200 transition-colors text-sm sm:text-base">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-orange-200 transition-colors text-sm sm:text-base">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-orange-200 transition-colors text-sm sm:text-base">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Customer Service</h3>
          <ul className="space-y-1 sm:space-y-2">
            <li>
              <Link href="/products" className="hover:text-orange-200 transition-colors text-sm sm:text-base">
                Shipping & Returns
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-orange-200 transition-colors text-sm sm:text-base">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-orange-200 transition-colors text-sm sm:text-base">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Contact Info</h3>
          <p className="text-xs sm:text-sm mb-2">
            Email: <a href="mailto:info@doggdenn.com" className="hover:text-orange-200 transition-colors">info@doggdenn.com</a>
          </p>
          <p className="text-xs sm:text-sm mb-4">
            Phone: <a href="tel:+1234567890" className="hover:text-orange-200 transition-colors">(123) 456-7890</a>
          </p>
        </div>

        {/* About DoggDenn */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">About DoggDenn</h3>
          <p className="text-xs sm:text-sm leading-relaxed">
            Your one-stop shop for premium pet products. We are dedicated to providing quality items for your furry friends.
          </p>
        </div>
      </div>

      {/* Divider and Copyright */}
      <div className="border-t border-white border-opacity-20 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
        <p>&copy; {new Date().getFullYear()} DoggDenn. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
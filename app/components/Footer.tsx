import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-(--primary) text-white py-8 px-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/shop" className="hover:underline text-sm">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline text-sm">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline text-sm">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline text-sm">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-xl font-bold mb-4">Customer Service</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/shipping" className="hover:underline text-sm">
                Shipping & Returns
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:underline text-sm">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline text-sm">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Info</h3>
          <p className="text-sm">
            Email: info@doggdenn.com
          </p>
          <p className="text-sm">
            Phone: (123) 456-7890
          </p>
          <div className="flex space-x-4 mt-4">
            {/* Social Media Icons (placeholders) */}
            <a href="#" aria-label="Facebook" className="hover:opacity-75">
              <Image src="/file.svg" alt="Facebook" width={24} height={24} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:opacity-75">
              <Image src="/file.svg" alt="Twitter" width={24} height={24} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:opacity-75">
              <Image src="/file.svg" alt="Instagram" width={24} height={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white border-opacity-20 mt-8 pt-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Doggdenn. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
'use client'; 

import Link from "next/link";
import Image from "next/image";
import { useState } from 'react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import AdminOnly from './AdminOnly';
import CartIcon from './CartIcon';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="flex justify-between p-2 items-center bg-[#FAF8F3] shadow-md relative z-10">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="DoggDenn Logo"
          width={120}
          height={120}
          quality={100}
          priority
        />
        <span className="hidden sm:inline text-2xl font-bold text-[#7d3d23]">
          DoggDenn
        </span>
      </Link>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex gap-6">
        <Link href="/" className="text-[#7d3d23] text-xl hover:opacity-80 transition-opacity duration-200">
          Home
        </Link>
        <Link href="/products" className="text-[#7d3d23] text-xl hover:opacity-80 transition-opacity duration-200">
          Products
        </Link>
        <Link href="/about" className="text-[#7d3d23] text-xl hover:opacity-80 transition-opacity duration-200">
          About
        </Link>
        <Link href="/contact" className="text-[#7d3d23] text-xl hover:opacity-80 transition-opacity duration-200">
          Contact
        </Link>
        <SignedIn>
          <Link href="/account" className="text-[#7d3d23] text-xl hover:opacity-80 transition-opacity duration-200">
            Account
          </Link>
        </SignedIn>
        <AdminOnly>
          <Link
            href="/admin-dashboard"
            className="text-[#7d3d23] text-xl hover:opacity-80 transition-opacity duration-200"
          >
            Admin Dashboard
          </Link>
        </AdminOnly>
      </nav>

      {/* Mobile Menu Button (Hamburger) */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMobileMenu} className="text-[#7d3d23] focus:outline-none hover:cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            )}
          </svg>
        </button>
      </div>

      {/* Clerk Authentication Buttons (Desktop) */}
      <div className="hidden md:flex items-center gap-6">
        <CartIcon />
        <SignedOut>
          <SignInButton />
          <SignUpButton>
            <button className="bg-[#C09A7F] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-[#B08874] transition-colors duration-200">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg flex flex-col items-center py-4 space-y-4">
          <Link href="/" className="text-[#7d3d23] hover:opacity-80 transition-opacity duration-200" onClick={toggleMobileMenu}>
            Home
          </Link>
          <Link href="/products" className="text-[#7d3d23] text-xl hover:opacity-80 transition-opacity duration-200" onClick={toggleMobileMenu}>
            Products
          </Link>
          <Link href="/about" className="text-[#7d3d23] hover:opacity-80 transition-opacity duration-200" onClick={toggleMobileMenu}>
            About
          </Link>
          <Link href="/contact" className="text-[#7d3d23] hover:opacity-80 transition-opacity duration-200" onClick={toggleMobileMenu}>
            Contact
          </Link>
          <SignedIn>
            <Link href="/account" className="text-[#7d3d23] hover:opacity-80 transition-opacity duration-200" onClick={toggleMobileMenu}>
              Account
            </Link>
          </SignedIn>
          <AdminOnly>
            <Link
              href="/admin-dashboard"
              className="text-[#7d3d23] hover:opacity-80 transition-opacity duration-200"
              onClick={toggleMobileMenu}
            >
              Admin Dashboard
            </Link>
          </AdminOnly>
          <CartIcon />
          <div className="flex flex-col items-center gap-4 mt-4">
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#7d3d23] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:opacity-90 transition-opacity duration-200">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
}
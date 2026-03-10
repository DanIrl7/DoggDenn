'use client';

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import AdminOnly from './AdminOnly';
import CartIcon from './CartIcon';

type NavLinkProps = {
  href: string;
  pathname: string | null;
  children: React.ReactNode;
  onClick?: () => void;
};

function NavLink({ href, pathname, children, onClick }: NavLinkProps) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex flex-col items-center text-xl transition-colors duration-200 ${
        isActive ? 'font-bold text-amber-600' : 'text-primary hover:text-amber-600'
      }`}
    >
      {children}
      <span
        className={`text-lg leading-none transition-opacity duration-200 ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
      >
        🐾
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="flex relative justify-between p-2 items-center bg-[#FEF3C7]  shadow-lg z-10">
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
        <span className="hidden sm:inline text-2xl font-bold text-foreground">
          DoggDenn
        </span>
      </Link>

      {/* Desktop Navigation Links */}
      <nav className="hidden lg:flex gap-6 items-end">
        <NavLink href="/" pathname={pathname}>Home</NavLink>
        <NavLink href="/products" pathname={pathname}>Products</NavLink>
        <NavLink href="/about" pathname={pathname}>About</NavLink>
        <NavLink href="/contact" pathname={pathname}>Contact</NavLink>
        <AdminOnly>
          <NavLink href="/admin-dashboard" pathname={pathname}>Admin Dashboard</NavLink>
        </AdminOnly>
      </nav>

      {/* Mobile Menu Button (Hamburger) */}
      <div className="lg:hidden flex items-center gap-4">
        <CartIcon />

        <SignedOut>
          <div className="flex items-center gap-2">
            <SignInButton>
              <button className="text-sm font-semibold text-primary hover:text-amber-600 transition-colors duration-200">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="bg-secondary text-foreground rounded-full font-medium text-sm h-9 px-3 cursor-pointer hover:bg-secondary/80 transition-colors duration-200">
                Sign up
              </button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>

        <AdminOnly>
          <Link
            href="/admin-dashboard"
            className="text-sm font-semibold text-primary hover:text-amber-600 transition-colors duration-200"
          >
            Admin
          </Link>
        </AdminOnly>
        <button onClick={toggleMobileMenu} className="text-foreground focus:outline-none hover:cursor-pointer">
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
      <div className="hidden lg:flex items-center gap-6">
        <CartIcon />
        <SignedOut>
          <SignInButton />
          <SignUpButton>
            <button className="bg-secondary text-foreground rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-secondary/80 transition-colors duration-200">
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
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg flex flex-col items-center py-4 space-y-4">
          <NavLink href="/" pathname={pathname} onClick={toggleMobileMenu}>Home</NavLink>
          <NavLink href="/products" pathname={pathname} onClick={toggleMobileMenu}>Products</NavLink>
          <NavLink href="/about" pathname={pathname} onClick={toggleMobileMenu}>About</NavLink>
          <NavLink href="/contact" pathname={pathname} onClick={toggleMobileMenu}>Contact</NavLink>
          <AdminOnly>
            <NavLink href="/admin-dashboard" pathname={pathname} onClick={toggleMobileMenu}>Admin Dashboard</NavLink>
          </AdminOnly>
          <CartIcon onClick={toggleMobileMenu} />
          <div className="flex flex-col items-center gap-4 mt-4">
            <SignedOut>
              <SignInButton>
                <button className="text-sm font-semibold text-primary hover:text-amber-600 transition-colors duration-200">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-secondary text-foreground rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-secondary/80 transition-colors duration-200">
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
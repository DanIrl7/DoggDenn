'use client';

import Link from 'next/link';
import { useCartStore } from '@/app/store/cartStore';

type CartIconProps = {
  onClick?: () => void;
};

export default function CartIcon({ onClick }: CartIconProps) {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <Link
      href="/cart"
      onClick={onClick}
      className="relative flex items-center justify-center"
    >
      <svg
        className="w-6 h-6 text-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

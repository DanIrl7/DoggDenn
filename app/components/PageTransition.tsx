'use client'

import { useNavigationStore } from '@/app/store/navigationStore';

export default function PageTransition() {
  const isNavigating = useNavigationStore((s) => s.isNavigating);

  return (
    <>
      {/* Loading Bar */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 z-[9999] animate-pulse">
          <div className="h-full bg-white opacity-20 w-1/3 animate-[slideIn_0.8s_ease-in-out_infinite]"></div>
        </div>
      )}
    </>
  );
}

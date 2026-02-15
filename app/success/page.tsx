import { Suspense } from 'react';
import SuccessClient from '@/app/components/SuccessClient';

function LoadingFallback() {
  return (
    <main className="min-h-screen bg-[#FAF8F3] p-6 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Loading order details...</p>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessClient />
    </Suspense>
  );
}

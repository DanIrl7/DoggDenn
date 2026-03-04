import { Suspense } from 'react';
import OrderSuccessClient from '@/app/components/OrderSuccessClient';

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-gray-600">Loading order details...</p>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderSuccessClient />
    </Suspense>
  );
}

import { Suspense } from 'react';
import HomeClient from '../components/HomeClient';

// Loading component for suspense
function ShopLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
    </div>
  );
}

// Shop Page - E-commerce product listing
export default function ShopPage() {
  return (
    <Suspense fallback={<ShopLoading />}>
      <HomeClient basePath="/shop" />
    </Suspense>
  );
}

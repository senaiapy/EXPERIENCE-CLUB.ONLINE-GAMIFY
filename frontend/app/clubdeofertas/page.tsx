import { Suspense } from 'react';
import ClubDeOfertasClient from './ClubDeOfertasClient';

// Loading component
function ClubDeOfertasLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Cargando productos...</h2>
        <p className="text-gray-600">Experience Club</p>
      </div>
    </div>
  );
}

// Main page component - now using Client Component
export default function ClubDeOfertasPage() {
  return (
    <Suspense fallback={<ClubDeOfertasLoading />}>
      <ClubDeOfertasClient />
    </Suspense>
  );
}
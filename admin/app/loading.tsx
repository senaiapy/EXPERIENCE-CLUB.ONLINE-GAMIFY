export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main>
        {/* Hero Section Loading */}
        <section className="relative bg-gradient-to-r from-emerald-400 to-emerald-600 py-20 md:py-28">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="h-12 bg-white/20 rounded mb-4 animate-pulse mx-auto" style={{ width: '60%' }}></div>
            <div className="h-6 bg-white/20 rounded mb-8 animate-pulse mx-auto" style={{ width: '40%' }}></div>
            <div className="h-12 w-48 bg-white/20 rounded animate-pulse mx-auto"></div>
          </div>
        </section>

        {/* Category Filters Loading */}
        <section className="container mx-auto px-4 py-10">
          <div className="h-8 bg-gray-200 rounded mb-8 animate-pulse mx-auto" style={{ width: '30%' }}></div>
          <div className="flex flex-wrap justify-center gap-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-8 w-32 bg-gray-200 rounded-full animate-pulse"></div>
            ))}
          </div>
        </section>

        {/* Product Grid Loading */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse" style={{ width: '30%' }}></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '20%' }}></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="flex justify-between mb-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination Loading */}
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
              <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Brand Header Loading */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center animate-pulse">
                <div className="w-6 h-6 bg-purple-200 rounded"></div>
              </div>
              <div>
                <div className="h-6 w-48 bg-purple-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-32 bg-purple-200 rounded animate-pulse"></div>
              </div>
            </div>
            
            {/* Stats Loading */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="text-center">
                  <div className="h-6 w-12 bg-purple-200 rounded mx-auto mb-1 animate-pulse"></div>
                  <div className="h-4 w-16 bg-purple-200 rounded mx-auto animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Filters Section Loading */}
        <section className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="h-6 w-24 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item}>
                <div className="h-4 w-16 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Products Grid Loading */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        </section>
      </main>
    </div>
  );
}
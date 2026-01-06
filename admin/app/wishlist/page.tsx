export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-500 to-pink-600 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Mi Lista de Deseos
            </h1>
            <p className="text-pink-100 text-lg">
              Guarda tus productos favoritos aquí
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center py-12">
          <div className="text-6xl mb-6">💝</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Tu lista de deseos está vacía
          </h2>
          <p className="text-gray-500 mb-8">
            Explora nuestros productos y añade los que más te gusten
          </p>
          <a 
            href="/" 
            className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Explorar productos
          </a>
        </div>
      </main>
    </div>
  );
}
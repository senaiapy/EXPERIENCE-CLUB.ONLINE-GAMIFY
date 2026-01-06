import { promises as fs } from 'fs';
import path from 'path';
import { ClubDeOfertasProduct } from '@/types';
import ProductCard from '../../../components/ProductCard';

async function getArabicFeminineProducts(page: number = 1, limit: number = 24): Promise<{ products: ClubDeOfertasProduct[], total: number }> {
  try {
    const filePath = path.join(process.cwd(), 'database', 'products.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    let allProducts: ClubDeOfertasProduct[] = JSON.parse(jsonData);
    
    // Filter for Arabic feminine perfumes based on category and tags
    const arabicKeywords = ['árabe', 'arabic', 'oriental', 'oud', 'attar', 'musc'];
    const feminineKeywords = ['femenino', 'mujer', 'women', 'femme', 'female', 'dama'];
    
    allProducts = allProducts.filter(product => {
      const searchText = `${product.category} ${product.tags} ${product.name} ${product.description} ${product.brand_name}`.toLowerCase();
      const hasArabic = arabicKeywords.some(keyword => searchText.includes(keyword));
      const hasFeminine = feminineKeywords.some(keyword => searchText.includes(keyword));
      return hasArabic && hasFeminine;
    });
    
    const totalProducts = allProducts.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const products = allProducts.slice(start, end);
    
    return { products, total: totalProducts };
  } catch (error) {
    console.error('Error loading Arabic feminine products:', error);
    return { products: [], total: 0 };
  }
}

export default async function PerfumesArabesFeemninosPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 24;
  
  const { products, total } = await getArabicFeminineProducts(page, limit);
  const totalPages = Math.ceil(total / limit);
  
  const buildUrl = (pageNum: number) => {
    return `/categorias/perfumes-arabes-femeninos${pageNum > 1 ? `?page=${pageNum}` : ''}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Perfumes Árabes Femeninos
            </h1>
            <p className="text-purple-100 text-lg">
              Descubre la elegancia y tradición de los perfumes árabes para mujer
            </p>
            <div className="mt-4 inline-block bg-white/20 backdrop-blur-sm rounded-lg px-6 py-2">
              <span className="text-white font-semibold">{total} productos disponibles</span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2 items-center">
                  {page > 1 && (
                    <>
                      <a 
                        href={buildUrl(1)} 
                        className="px-4 py-2 bg-purple-600 text-white border border-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-semibold"
                      >
                        INICIO
                      </a>
                      <a 
                        href={buildUrl(page - 1)} 
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        Anterior
                      </a>
                    </>
                  )}
                  
                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    const pageNum = Math.max(1, Math.min(page - 2 + index, totalPages - 4)) + index;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <a
                        key={pageNum}
                        href={buildUrl(pageNum)}
                        className={`px-4 py-2 border rounded-lg transition-colors duration-200 ${
                          pageNum === page
                            ? 'bg-purple-500 text-white border-purple-500'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </a>
                    );
                  })}
                  
                  {page < totalPages && (
                    <>
                      <a 
                        href={buildUrl(page + 1)} 
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        Siguiente
                      </a>
                      <a 
                        href={buildUrl(totalPages)} 
                        className="px-4 py-2 bg-purple-600 text-white border border-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-semibold"
                      >
                        FINAL
                      </a>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌸</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No hay perfumes árabes femeninos disponibles
            </h2>
            <p className="text-gray-500">
              Vuelve pronto para ver nuevos productos de perfumería árabe
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
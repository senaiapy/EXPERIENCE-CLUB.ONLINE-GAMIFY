import { promises as fs } from 'fs';
import path from 'path';
import { ClubDeOfertasProduct } from '@/types';
import ProductCard from '../../../components/ProductCard';
import { notFound } from 'next/navigation';

async function getBrandProducts(brandSlug: string, page: number = 1, limit: number = 24): Promise<{ products: ClubDeOfertasProduct[], total: number, brandName: string }> {
  try {
    const filePath = path.join(process.cwd(), 'database', 'products.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    let allProducts: ClubDeOfertasProduct[] = JSON.parse(jsonData);
    
    // Convert slug back to brand name with proper handling
    let brandName = brandSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Handle special cases for brands with different formatting
    const brandMappings: { [key: string]: string } = {
      'dolce gabbana': 'Dolce & Gabbana',
      'dolcegabbana': 'Dolce & Gabbana',
      'emporio armani': 'Emporio Armani',
      'calvin klein': 'Calvin Klein',
      'perfumes arabes': 'Perfumes Arabes'
    };

    if (brandMappings[brandName.toLowerCase()]) {
      brandName = brandMappings[brandName.toLowerCase()];
    }
    
    // Filter products by brand name (case insensitive, partial match)
    allProducts = allProducts.filter(product => {
      if (!product.brand_name) return false;

      // For "Perfumes Arabes", search for Arabic perfume categories
      if (brandName === 'Perfumes Arabes') {
        return product.category && (
          product.category.toLowerCase().includes('árabe') ||
          product.category.toLowerCase().includes('arabes') ||
          product.tags.toLowerCase().includes('árabe') ||
          product.tags.toLowerCase().includes('arabes')
        );
      }

      // For other brands, match the brand field
      return product.brand_name.toLowerCase().includes(brandName.toLowerCase()) ||
             brandName.toLowerCase().includes(product.brand_name.toLowerCase());
    });
    
    const totalProducts = allProducts.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const products = allProducts.slice(start, end);
    
    return { products, total: totalProducts, brandName };
  } catch (error) {
    console.error('Error loading brand products:', error);
    return { products: [], total: 0, brandName: brandSlug };
  }
}

interface PageProps {
  params: { brand: string };
  searchParams: { page?: string };
}

export default async function BrandPage({ params, searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 24;
  
  const { products, total, brandName } = await getBrandProducts(params.brand, page, limit);
  const totalPages = Math.ceil(total / limit);
  
  // If no products found, return 404
  if (total === 0) {
    notFound();
  }
  
  const buildUrl = (pageNum: number) => {
    return `/marcas/${params.brand}${pageNum > 1 ? `?page=${pageNum}` : ''}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Brand Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {brandName}
            </h1>
            <p className="text-slate-200 text-lg">
              Descubre todos los productos de {brandName}
            </p>
            <div className="mt-4 inline-block bg-white/20 backdrop-blur-sm rounded-lg px-6 py-2">
              <span className="text-white font-semibold">{total} productos disponibles</span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
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
                    className="px-4 py-2 bg-slate-700 text-white border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors duration-200 font-semibold"
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
                        ? 'bg-slate-600 text-white border-slate-600'
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
                    className="px-4 py-2 bg-slate-700 text-white border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors duration-200 font-semibold"
                  >
                    FINAL
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
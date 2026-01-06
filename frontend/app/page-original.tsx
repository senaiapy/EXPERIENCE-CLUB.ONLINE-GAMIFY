import { promises as fs } from 'fs';
import path from 'path';

import { ClubDeOfertasProduct } from '../types';

// Function to read and parse CSV data with pagination support
async function getProducts(page: number = 1, limit: number = 12): Promise<{ products: ClubDeOfertasProduct[], total: number }> {
  // Read the CSV file from the correct location
  const filePath = path.join(process.cwd(), 'products.csv');
  const fallbackPath = path.join(process.cwd(), 'clubdeofertas_products.csv');
  
  let csvData: string;
  try {
    csvData = await fs.readFile(filePath, 'utf8');
  } catch (error) {
    // Fallback to original file if larger dataset doesn't exist
    csvData = await fs.readFile(fallbackPath, 'utf8');
  }
  
  // Parse CSV data (simple implementation without external libraries)
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  
  const allProducts: ClubDeOfertasProduct[] = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    
    // Split by comma but respect quoted fields
    const values = parseCSVLine(lines[i]);
    const product: ClubDeOfertasProduct = {
      id: values[0] || '',
      category: values[1] || '',
      name: values[2] || '',
      stockStatus: values[3] || '',
      referenceId: values[4] || '',
      tags: values[5] || '',
      brand_name: values[6] || '',
      description: values[7] || '',
      specifications: values[8] || '',
      details: values[9] || '',
      price: values[10] || '',
      price_sale: values[11] || '',
      images: values[12] || ''
    };
    allProducts.push(product);
  }
  
  // Calculate pagination
  const total = allProducts.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const products = allProducts.slice(start, end);
  
  return { products, total };
}

// Function to parse CSV line with proper comma handling
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current);
  return values;
}



import ProductCard from '../components/ProductCard';
import Carousel from '../components/Carousel';

// Main Page Component
export default async function Home({ searchParams }: { searchParams: { page?: string } }) {
  // Get page from search params or default to 1
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 24; // Products per page
  
  // Fetch products data with pagination
  const { products, total } = await getProducts(page, limit);
  
  // Calculate pagination values
  const totalPages = Math.ceil(total / limit);
  
  // Extract unique categories
  const categories = Array.from(new Set(products.map(product => product.category)));
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-emerald-400 to-emerald-600 py-20 md:py-28">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Descubre Tu Estilo</h1>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">Nuevas llegadas, Precios Imbatibles</p>
            <button className="bg-white text-emerald-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg">
              Comprar Ahora
            </button>
          </div>
        </section>

        {/* Carousel Section */}
        <section className="container mx-auto px-4 py-12">
          <Carousel />
        </section>

        {/* Category Filters */}
        <section className="container mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-center mb-8">Comprar por Categoría</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <button 
                key={index} 
                className="px-5 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors duration-300"
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Product Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Productos Destacados</h2>
            <div className="text-gray-600">
              Mostrando {Math.min((page - 1) * limit + 1, total)} - {Math.min(page * limit, total)} de {total} productos
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                {page > 1 && (
                  <a 
                    href={`/?page=${page - 1}`} 
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Anterior
                  </a>
                )}
                
                {/* Show first page */}
                {page > 3 && (
                  <>
                    <a 
                      href="/?page=1" 
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      1
                    </a>
                    {page > 4 && (
                      <span className="px-4 py-2 text-gray-500">...</span>
                    )}
                  </>
                )}
                
                {/* Show pages around current page */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <a 
                      key={pageNum}
                      href={`/?page=${pageNum}`} 
                      className={`px-4 py-2 border rounded-lg transition-colors duration-200 ${
                        pageNum === page 
                          ? 'bg-emerald-500 text-white border-emerald-500' 
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </a>
                  );
                })}
                
                {/* Show last page */}
                {page < totalPages - 2 && (
                  <>
                    {page < totalPages - 3 && (
                      <span className="px-4 py-2 text-gray-500">...</span>
                    )}
                    <a 
                      href={`/?page=${totalPages}`} 
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      {totalPages}
                    </a>
                  </>
                )}
                
                {page < totalPages && (
                  <a 
                    href={`/?page=${page + 1}`} 
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Siguiente
                  </a>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Experience Club</h3>
              <p className="text-gray-400">Tu destino para las mejores ofertas en perfumes y más.</p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Acerca de Nosotros</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Nuestra Historia</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Prensa</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Servicio al Cliente</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Contáctanos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Envío</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Devoluciones e Intercambios</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
            <p>&copy; 2023 Experience Club. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
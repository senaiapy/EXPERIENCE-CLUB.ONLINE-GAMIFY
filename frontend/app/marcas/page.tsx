import MarcasClient from './client';
import { ClubDeOfertasProduct } from '@/types';
import { productsApi, convertToClubDeOfertasProduct } from '@/lib/products-api';

// Function to convert ClubDeOfertasProduct to BrandProduct format for compatibility
interface BrandProduct {
  id: string;
  name: string;
  descripcion: string;
  buy_price: string;
  sell_price: string;
  marca: string;
  categoria_marca: string;
  ref: string;
  disponibilidad: string;
  main_image: string;
  additional_images: string;
  categorias: string;
  tags: string;
}

// Function to convert ClubDeOfertasProduct to BrandProduct
function convertToBrandProduct(product: ClubDeOfertasProduct): BrandProduct {
  return {
    id: product.id,
    name: product.name,
    descripcion: product.description,
    buy_price: product.price,
    sell_price: product.price_sale,
    marca: product.brand_name,
    categoria_marca: product.category,
    ref: product.referenceId,
    disponibilidad: product.stockStatus,
    main_image: product.images,
    additional_images: '',
    categorias: product.category,
    tags: product.tags
  };
}

// Function to get brand products from API with pagination support
async function getBrandProducts(page: number = 1, limit: number = 12): Promise<{ products: BrandProduct[], total: number }> {
  try {
    console.log(`Loading brand products from API for page ${page}...`);

    // Get products from API
    const apiResponse = await productsApi.getProducts({
      page,
      limit,
      sortBy: 'name',
      sortOrder: 'asc'
    });

    // Convert API products to ClubDeOfertasProduct format, then to BrandProduct
    const clubProducts = apiResponse.products.map(convertToClubDeOfertasProduct);

    // Filter products that have valid brand information and convert to BrandProduct
    const brandProducts = clubProducts
      .filter(product => product.brand_name && product.brand_name.trim() !== '' && product.brand_name !== 'N/A')
      .map(convertToBrandProduct);

    console.log(`Returning ${brandProducts.length} brand products from API`);
    return {
      products: brandProducts.slice(0, limit), // Ensure we don't exceed limit
      total: apiResponse.pagination.total
    };
  } catch (error) {
    console.error('Error loading brand products from API:', error);
    return { products: [], total: 0 };
  }
}

// Main Page Component for brands
export default async function MarcasPage({ searchParams }: { searchParams: { page?: string } }) {
  // Get page from search params or default to 1
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 12; // Products per page
  
  // Fetch brand products data with pagination
  const { products, total } = await getBrandProducts(page, limit);
  
  // Calculate pagination values
  const totalPages = Math.ceil(total / limit);
  
  // Extract unique brands and categories
  const brands = Array.from(new Set(products.map(product => product.marca)));
  const categories = Array.from(new Set(products.map(product => product.categoria_marca)));
  
  // Calculate statistics
  const totalProducts = total; // Use total from paginated results
  const totalBrands = brands.length;
  const avgPrice = products.reduce((sum, p) => sum + (parseFloat(p.sell_price) || 0), 0) / products.length;
  
  // Format average price in USD
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Brand Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-2xl">🏷️</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Experience Club - Marcas</h1>
                <p className="text-purple-200">Descubre nuestros productos por marca</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-center">
                <div className="text-white font-bold text-xl">{totalProducts}</div>
                <div className="text-purple-200 text-sm">Productos</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-xl">{totalBrands}</div>
                <div className="text-purple-200 text-sm">Marcas</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-xl">{formatPrice(avgPrice)}</div>
                <div className="text-purple-200 text-sm">Precio Promedio</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Products Grid */}
        <section>
          <MarcasClient 
            initialProducts={products} 
            total={total} 
            page={page} 
            limit={limit} 
          />
        </section>
      </main>
    </div>
  );
}
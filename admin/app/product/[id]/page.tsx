import { promises as fs } from 'fs';
import path from 'path';
import { ClubDeOfertasProduct } from '@/types';
import ProductDetailClient from './ProductDetailClient';

async function getProductById(id: string): Promise<ClubDeOfertasProduct | null> {
  try {
    const filePath = path.join(process.cwd(), 'database', 'products.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const allProducts: ClubDeOfertasProduct[] = JSON.parse(jsonData);
    
    const product = allProducts.find(p => p.id === id);
    return product || null;
  } catch (error) {
    console.error('Error loading product:', error);
    return null;
  }
}

async function getRelatedProducts(currentProduct: ClubDeOfertasProduct): Promise<ClubDeOfertasProduct[]> {
  try {
    const filePath = path.join(process.cwd(), 'database', 'products.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const allProducts: ClubDeOfertasProduct[] = JSON.parse(jsonData);
    
    // Find related products by category or brand
    const related = allProducts
      .filter(p =>
        p.id !== currentProduct.id &&
        (p.category === currentProduct.category || p.brand_name === currentProduct.brand_name)
      )
      .slice(0, 4);
      
    return related;
  } catch (error) {
    console.error('Error loading related products:', error);
    return [];
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h1>
          <p className="text-gray-600 mb-4">El producto que buscas no existe o ha sido removido</p>
          <a 
            href="/" 
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Volver al catálogo
          </a>
        </div>
      </div>
    );
  }

  const relatedProducts = await getRelatedProducts(product);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
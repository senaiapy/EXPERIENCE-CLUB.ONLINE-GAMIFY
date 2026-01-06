'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ClubDeOfertasProduct } from '@/types';
import { productsApi, convertToClubDeOfertasProduct } from '@/lib/products-api';
import ProductDetailClient from './ProductDetailClient';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<ClubDeOfertasProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ClubDeOfertasProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        console.log(`Loading product ${id} from API...`);

        const apiProduct = await productsApi.getProductById(id);
        const productData = convertToClubDeOfertasProduct(apiProduct);
        setProduct(productData);

        // Load related products
        console.log(`Loading related products for category: ${productData.category}`);
        const categoryResponse = await productsApi.searchProducts(productData.category, {
          limit: 8,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });

        const related = categoryResponse.products
          .filter(p => p.id !== productData.id)
          .slice(0, 4)
          .map(convertToClubDeOfertasProduct);

        setRelatedProducts(related);
      } catch (error) {
        console.error('Error loading product:', error);
        setError('Error al cargar el producto');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
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

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
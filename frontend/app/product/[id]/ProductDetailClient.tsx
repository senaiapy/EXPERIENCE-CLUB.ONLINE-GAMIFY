'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ClubDeOfertasProduct } from '@/types';
import ProductCard from '../../../components/ProductCard';
import Toast from '../../../components/Toast';
import { wishlistApi } from '@/lib/wishlist-api';
import { cartApi } from '@/lib/cart-api';
import { useAuth } from '@/contexts/AuthContext';
import { getImageUrl, getPlaceholderUrl } from '@/lib/image-utils';

interface ProductDetailClientProps {
  product: ClubDeOfertasProduct;
  relatedProducts: ClubDeOfertasProduct[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  // Prices are already in Guaraníes - format directly
  const formatGuaraniPrice = (price: string) => {
    const priceInGs = parseFloat(price) || 0;
    return '₲' + new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(priceInGs);
  };

  const calculateDiscount = () => {
    const priceInGs = parseFloat(product.price) || 0;
    const salePriceInGs = parseFloat(product.price_sale) || priceInGs;
    if (salePriceInGs > priceInGs) {
      return Math.round(((salePriceInGs - priceInGs) / salePriceInGs) * 100);
    }
    return 0;
  };

  const addToCart = async () => {
    if (!isAuthenticated) {
      setToast({ message: t('productDetail.mustLoginToAddToCart'), type: 'error' });
      setTimeout(() => router.push('/auth/login'), 2000);
      return;
    }

    setIsAddingToCart(true);
    try {
      await cartApi.addToCart({
        productId: product.id,
        quantity: quantity
      });

      // Dispatch cart updated event
      const event = new CustomEvent('cartUpdated');
      window.dispatchEvent(event);

      setToast({ message: `${product.name} ${t('productDetail.addedToCart')} (${quantity} ${quantity > 1 ? t('productDetail.unitsPlural') : t('productDetail.units')})`, type: 'success' });
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      setToast({ message: error.response?.data?.message || t('productDetail.errorAddingToCart'), type: 'error' });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const buyNow = async () => {
    if (!isAuthenticated) {
      setToast({ message: t('productDetail.mustLoginToBuy'), type: 'error' });
      setTimeout(() => router.push('/auth/login'), 2000);
      return;
    }

    setIsAddingToCart(true);
    try {
      await cartApi.addToCart({
        productId: product.id,
        quantity: quantity
      });

      // Dispatch cart updated event
      const event = new CustomEvent('cartUpdated');
      window.dispatchEvent(event);

      // Redirect to checkout
      router.push('/checkout');
    } catch (error: any) {
      console.error('Error in buy now:', error);
      setToast({ message: error.response?.data?.message || t('productDetail.errorProcessingPurchase'), type: 'error' });
      setIsAddingToCart(false);
    }
  };

  const isAvailable = () => {
    const availability = product.stockStatus?.toLowerCase() || '';
    return availability.includes('disponivel') ||
           availability.includes('estoque') ||
           availability.includes('stock') ||
           availability.includes('sim') ||
           availability.includes('yes') ||
           availability.includes('available');
  };

  // Get image URL using centralized utility
  // Images are served from backend at IMAGE_BASE_URL
  const mainImageUrl = getImageUrl(product.images);

  // Mock multiple images for gallery (using same image for now)
  const productImages = [
    mainImageUrl,
    mainImageUrl, // Duplicate for demo
    mainImageUrl, // Duplicate for demo
  ];

  const discount = calculateDiscount();

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex text-sm text-gray-600">
            <Link href="/" className="hover:text-emerald-600">{t('nav.home')}</Link>
            <span className="mx-2">/</span>
            <Link href="/" className="hover:text-emerald-600">{t('home.products')}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{product.name?.substring(0, 50)}...</span>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <div className="mb-4">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getPlaceholderUrl();
                  }}
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${
                      selectedImage === index ? 'border-emerald-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Vista ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getPlaceholderUrl();
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {product.name}
                  </h1>
                  <button
                    onClick={async () => {
                      if (!isAuthenticated) {
                        setToast({ message: t('productDetail.mustLoginToAddToCart'), type: 'error' });
                        setTimeout(() => router.push('/auth/login'), 2000);
                        return;
                      }

                      setIsAddingToWishlist(true);
                      try {
                        await wishlistApi.addToWishlist({ productId: product.id });

                        // Dispatch wishlist updated event
                        const event = new CustomEvent('wishlistUpdated');
                        window.dispatchEvent(event);

                        setToast({ message: `${product.name} ${t('productDetail.addedToCart')}`, type: 'success' });
                      } catch (error: any) {
                        console.error('Error adding to wishlist:', error);
                        setToast({ message: error.response?.data?.message || t('productDetail.errorAddingToCart'), type: 'error' });
                      } finally {
                        setIsAddingToWishlist(false);
                      }
                    }}
                    disabled={isAddingToWishlist}
                    className="ml-3 p-2 text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                    title={t('nav.wishlist')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>
                <p className="text-lg text-emerald-600 font-medium mb-1">
                  {product.brand_name}
                </p>
                <p className="text-gray-600">
                  REF: {product.referenceId}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-3xl font-bold text-emerald-600">
                    {formatGuaraniPrice(product.price)}
                  </span>
                  {product.price_sale && parseFloat(product.price_sale) > parseFloat(product.price) && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        {formatGuaraniPrice(product.price_sale)}
                      </span>
                      {discount > 0 && (
                        <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full font-bold">
                          -{discount}%
                        </span>
                      )}
                    </>
                  )}
                </div>

                <p className="text-sm text-gray-500">{t('productDetail.priceIncludesTaxes')}</p>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isAvailable() ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`font-medium ${isAvailable() ? 'text-green-600' : 'text-red-600'}`}>
                    {isAvailable() ? t('product.available') : t('product.outOfStock')}
                  </span>
                </div>
                {isAvailable() && (
                  <p className="text-sm text-gray-600 mt-1">
                    {t('productDetail.readyForShipping')}
                  </p>
                )}
              </div>

              {/* Quantity and Actions */}
              {isAvailable() && (
                <div className="mb-8">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('productDetail.quantity')}
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={addToCart}
                      disabled={isAddingToCart}
                      className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {isAddingToCart ? t('product.processing') : t('product.addToCart')}
                    </button>
                    <button
                      onClick={buyNow}
                      disabled={isAddingToCart}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {isAddingToCart ? t('product.processing') : t('product.buyNow')}
                    </button>
                  </div>
                </div>
              )}

              {/* Product Features */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('productDetail.features')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('productDetail.originalProduct')}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('productDetail.qualityGuarantee')}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('productDetail.freeShipping')}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('productDetail.freeReturn')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('productDetail.description')}</h2>
            <div className="prose max-w-none text-gray-600">
              <p className="leading-relaxed">
                {product.description}
              </p>
              {product.specifications && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{t('productDetail.specifications')}</h3>
                  <p>{product.specifications}</p>
                </div>
              )}
              {product.details && product.details !== product.description && (
                <div className="mt-4">
                  <p>{product.details}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('productDetail.relatedProducts')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
    </>
  );
}
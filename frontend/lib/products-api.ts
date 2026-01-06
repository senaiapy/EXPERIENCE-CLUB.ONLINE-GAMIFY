import { api } from './axios';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  specifications: string;
  details: string;
  price: number;
  price_sale?: number;
  stock: number;
  stockStatus: string;
  stockQuantity: number;
  referenceId?: string;
  tags: string[];
  brandId: string;
  categoryId: string;
  image_name?: string;
  brand_name?: string;
  createdAt: string;
  updatedAt: string;
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: Array<{
    id: string;
    filename: string;
    size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'HOME';
    url: string;
  }>;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    search?: string;
    brandId?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    stockStatus?: string;
    tags?: string;
    referenceId?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  brandId?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: string;
  tags?: string;
  referenceId?: string;
  sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt' | 'stock';
  sortOrder?: 'asc' | 'desc';
}

// Products API service
export const productsApi = {
  // Get all products with pagination and filters
  async getProducts(params: ProductsQueryParams = {}): Promise<ProductsResponse> {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get product by ID
  async getProductById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get product by slug
  async getProductBySlug(slug: string): Promise<Product> {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  // Search products by value
  async searchProducts(value: string, params: ProductsQueryParams = {}): Promise<ProductsResponse> {
    const response = await api.get(`/products/search/value/${encodeURIComponent(value)}`, { params });
    return response.data;
  },

  // Search products by column
  async searchByColumn(column: string, value: string, params: ProductsQueryParams = {}): Promise<ProductsResponse> {
    const response = await api.get(`/products/search/column/${column}/${encodeURIComponent(value)}`, { params });
    return response.data;
  },
};

// Helper function to convert API Product to frontend ClubDeOfertasProduct format
export function convertToClubDeOfertasProduct(apiProduct: Product) {
  // Priority for image: 1) images array, 2) image_name field, 3) placeholder
  const imageUrl = apiProduct.images?.find(img => img.size === 'HOME')?.url ||
                   apiProduct.images?.find(img => img.size === 'LARGE')?.url ||
                   apiProduct.images?.[0]?.url ||
                   apiProduct.image_name ||
                   'no-image.jpg';

  return {
    id: apiProduct.id,
    category: apiProduct.category?.name || 'Sin categoría',
    name: apiProduct.name || 'Producto sin nombre',
    stockStatus: apiProduct.stockStatus || (apiProduct.stock > 0 ? 'En stock' : 'Agotado'),
    referenceId: apiProduct.referenceId || '',
    tags: Array.isArray(apiProduct.tags) ? apiProduct.tags.join(', ') : '',
    brand_name: apiProduct.brand?.name || apiProduct.brand_name || 'Sin marca',
    description: apiProduct.description || 'Sin descripción',
    specifications: apiProduct.specifications || '',
    details: apiProduct.details || '',
    price: apiProduct.price.toString(),
    price_sale: (apiProduct.price_sale || apiProduct.price).toString(),
    images: imageUrl
  };
}

export default productsApi;
// Backend-aligned Product types

export interface Brand {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ProductImage {
  id: string;
  filename: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'HOME';
  url: string;
  productId: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // USD
  stock: number;
  price_sale?: number;
  stockStatus: string;
  stockQuantity: string;
  specifications?: string;
  details?: string;
  referenceId?: string;
  tags: string[];
  isFeatured: boolean;
  brandId: string;
  categoryId: string;
  image_name?: string;
  brand_name?: string;
  createdAt: string;
  updatedAt: string;
  brand?: Brand;
  category?: Category;
  images: ProductImage[];
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductQuery {
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

// Legacy CartProduct for backward compatibility
export interface CartProduct extends Product {
  selectedSize?: 'S' | 'M' | 'L';
  quantity?: number;
}

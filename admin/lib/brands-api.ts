import { api } from './axios';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface BrandsResponse {
  data: Brand[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
    startItem: number;
    endItem: number;
  };
}

export interface BrandsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Brands API service
export const brandsApi = {
  // Get all brands
  async getBrands(params: BrandsQueryParams = {}): Promise<BrandsResponse> {
    const response = await api.get('/brands', { params });
    return response.data;
  },

  // Get brand by ID
  async getBrandById(id: string): Promise<Brand> {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  },

  // Get brand by slug
  async getBrandBySlug(slug: string): Promise<Brand> {
    const response = await api.get(`/brands/slug/${slug}`);
    return response.data;
  },

  // Create new brand (Admin only)
  async createBrand(brandData: Partial<Brand>): Promise<Brand> {
    const response = await api.post('/brands', brandData);
    return response.data;
  },

  // Update brand (Admin only)
  async updateBrand(id: string, brandData: Partial<Brand>): Promise<Brand> {
    const response = await api.patch(`/brands/${id}`, brandData);
    return response.data;
  },

  // Delete brand (Admin only)
  async deleteBrand(id: string): Promise<void> {
    await api.delete(`/brands/${id}`);
  },
};

export default brandsApi;
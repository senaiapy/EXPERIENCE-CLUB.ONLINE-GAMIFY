import { api } from './axios';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  parent?: Category;
  children?: Category[];
  _count?: {
    products: number;
  };
}

export interface CategoriesResponse {
  data: Category[];
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

export interface CategoriesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  includeProducts?: boolean;
}

// Categories API service
export const categoriesApi = {
  // Get all categories
  async getCategories(params: CategoriesQueryParams = {}): Promise<CategoriesResponse> {
    const response = await api.get('/categories', { params });
    return response.data;
  },

  // Get category by ID
  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data;
  },

  // Create new category (Admin only)
  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Update category (Admin only)
  async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
    const response = await api.patch(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category (Admin only)
  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};

export default categoriesApi;
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { Product, SearchParams } from '@/lib/schemas';

// Get products with search/filter
export const useProducts = (params: SearchParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async (): Promise<{ products: Product[]; total: number }> => {
      const response = await api.get('/products', { params });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get single product
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async (): Promise<Product> => {
      const response = await api.get(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Add product to favorites
export const useAddToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.post('/favorites', { productId });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate favorites list
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

// Get user favorites
export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async (): Promise<Product[]> => {
      const response = await api.get('/favorites');
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
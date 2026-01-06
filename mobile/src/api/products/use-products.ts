import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Product, ProductQuery, ProductsResponse } from './types';

type Variables = ProductQuery;
type Response = ProductsResponse;

export const useProducts = createQuery<Response, Variables, Error>({
  queryKey: ['products'],
  fetcher: async (variables) => {
    const params = new URLSearchParams();
    if (variables.page) params.append('page', variables.page.toString());
    if (variables.limit) params.append('limit', variables.limit.toString());
    if (variables.categoryId) params.append('categoryId', variables.categoryId);
    if (variables.search) params.append('search', variables.search);

    const { data } = await client.get<{
      products: Product[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/products?${params.toString()}`);

    // Transform to match ProductsResponse
    return {
      data: data?.products || [],
      total: data?.pagination?.total || 0,
      page: data?.pagination?.page || variables.page || 1,
      limit: data?.pagination?.limit || variables.limit || 20,
    };
  },
});

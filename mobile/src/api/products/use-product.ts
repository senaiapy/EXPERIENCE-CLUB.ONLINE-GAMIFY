import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Product } from './types';

type Variables = { id: string };
type Response = Product;

export const useProduct = createQuery<Response, Variables, Error>({
  queryKey: ['product'],
  fetcher: async (variables) => {
    const { data } = await client.get<Product>(`/products/${variables.id}`);
    return data;
  },
});

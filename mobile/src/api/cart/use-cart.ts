import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Cart } from './types';

type Response = Cart;
type Variables = void;

export const useCart = createQuery<Response, Variables, AxiosError>({
  queryKey: ['cart'],
  fetcher: () => {
    return client.get(`/cart`).then((response) => response.data);
  },
});

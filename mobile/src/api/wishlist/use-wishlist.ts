import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Wishlist } from './types';

type Response = Wishlist;
type Variables = void;

export const useWishlist = createQuery<Response, Variables, AxiosError>({
  queryKey: ['wishlist'],
  fetcher: () => {
    return client.get(`/wishlist`).then((response) => response.data);
  },
});

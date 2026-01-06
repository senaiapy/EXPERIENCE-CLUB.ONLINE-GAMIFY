import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { Wishlist } from './types';

type Variables = {
  productId: string;
};
type Response = Wishlist;

export const useRemoveFromWishlist = createMutation<Response, Variables, AxiosError>({
  mutationFn: async ({ productId }) =>
    client.delete(`/wishlist/${productId}`).then((response) => response.data),
});

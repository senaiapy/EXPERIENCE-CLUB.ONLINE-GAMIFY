import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { AddToWishlistDto, Wishlist } from './types';

type Variables = AddToWishlistDto;
type Response = Wishlist;

export const useAddToWishlist = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client.post(`/wishlist`, variables).then((response) => response.data),
});

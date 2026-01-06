import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { AddToCartDto, Cart } from './types';

type Variables = AddToCartDto;
type Response = Cart;

export const useAddToCart = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client.post(`/cart`, variables).then((response) => response.data),
});

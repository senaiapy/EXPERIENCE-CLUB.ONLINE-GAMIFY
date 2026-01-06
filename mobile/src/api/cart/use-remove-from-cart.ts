import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { Cart } from './types';

type Variables = {
  productId: string;
};
type Response = Cart;

export const useRemoveFromCart = createMutation<Response, Variables, AxiosError>({
  mutationFn: async ({ productId }) =>
    client.delete(`/cart/${productId}`).then((response) => response.data),
});

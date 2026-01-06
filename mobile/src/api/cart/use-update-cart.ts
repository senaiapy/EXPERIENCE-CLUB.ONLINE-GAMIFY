import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { UpdateCartItemDto, Cart } from './types';

type Variables = {
  productId: string;
  data: UpdateCartItemDto;
};
type Response = Cart;

export const useUpdateCart = createMutation<Response, Variables, AxiosError>({
  mutationFn: async ({ productId, data }) =>
    client.patch(`/cart/${productId}`, data).then((response) => response.data),
});

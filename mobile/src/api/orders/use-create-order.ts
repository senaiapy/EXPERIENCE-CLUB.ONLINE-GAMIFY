import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { CreateOrderDto, Order } from './types';

type Variables = CreateOrderDto;
type Response = Order;

export const useCreateOrder = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client.post(`/orders`, variables).then((response) => response.data),
});

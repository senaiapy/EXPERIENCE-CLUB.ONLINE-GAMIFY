import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Order } from './types';

type Response = Order;
type Variables = { id: string };

export const useOrder = createQuery<Response, Variables>({
  queryKey: ['order'],
  fetcher: (variables) => {
    return client.get(`/orders/${variables.id}`).then((response) => response.data);
  },
});

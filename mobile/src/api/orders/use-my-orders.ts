import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { Order, OrderQuery } from './types';

type Response = Order[];
type Variables = OrderQuery;

export const useMyOrders = createQuery<Response, Variables>({
  queryKey: ['my-orders'],
  fetcher: (variables) => {
    const params = new URLSearchParams();
    if (variables.page) params.append('page', variables.page.toString());
    if (variables.limit) params.append('limit', variables.limit.toString());
    if (variables.status) params.append('status', variables.status);
    if (variables.paymentStatus) params.append('paymentStatus', variables.paymentStatus);

    return client
      .get(`/orders/my-orders?${params.toString()}`)
      .then((response) => response.data);
  },
});

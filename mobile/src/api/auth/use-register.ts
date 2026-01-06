import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { RegisterRequest, AuthResponse } from './types';

type Variables = RegisterRequest;
type Response = AuthResponse;

export const useRegister = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client.post(`/auth/register`, variables).then((response) => response.data),
});

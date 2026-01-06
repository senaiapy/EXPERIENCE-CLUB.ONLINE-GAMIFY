import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { LoginRequest, AuthResponse } from './types';

type Variables = LoginRequest;
type Response = AuthResponse;

export const useLogin = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client.post(`/auth/login`, variables).then((response) => response.data),
});

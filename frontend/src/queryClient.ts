import { QueryClient } from '@tanstack/react-query';
import { getErrorMessage } from './api/http';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
    mutations: {
      onError: (error) => {
        console.error(getErrorMessage(error));
      },
    },
  },
});

import { QueryClient } from '@tanstack/react-query';
import { isApiError } from '@/shared/api';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (count, error) => {
          if (isApiError(error) && error.status >= 400 && error.status < 500) {
            return false;
          }
          return count < 2;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

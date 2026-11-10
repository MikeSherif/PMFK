'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { routes } from '@/shared/config';
import { viewerKeys } from '@/entities/viewer';
import { logoutSession } from '../api/auth-api';

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutSession,
    onSettled: async () => {
      queryClient.removeQueries({ queryKey: viewerKeys.all });
      router.replace(routes.connect.login);
      router.refresh();
    },
  });
}

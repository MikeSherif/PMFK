'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { isApiError } from '@/shared/api';
import { matchKeys } from '@/entities/match';
import {
  defaultFeedFilters,
  profileKeys,
  saveCatalogProfile,
  sendCatalogInterest,
  skipCatalogProfile,
  unsaveCatalogProfile,
  type CatalogProfile,
  type FeedPage,
} from '@/entities/profile';
import { browseFeedCopy } from './content';

function patchFeed(current: FeedPage | undefined, id: string, patch: (item: CatalogProfile) => CatalogProfile | null) {
  if (!current) {
    return current;
  }
  const items = current.items
    .map((item) => (item.id === id ? patch(item) : item))
    .filter((item): item is CatalogProfile => item !== null);
  return { ...current, items, total: items.length };
}

export function useCatalogActions() {
  const queryClient = useQueryClient();
  const feedKey = profileKeys.feed(defaultFeedFilters);

  const skip = useMutation({
    mutationFn: skipCatalogProfile,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: feedKey });
      const previous = queryClient.getQueryData<FeedPage>(feedKey);
      queryClient.setQueryData(feedKey, (current: FeedPage | undefined) => patchFeed(current, id, () => null));
      return { previous };
    },
    onError: (error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(feedKey, context.previous);
      }
      toast.error(isApiError(error) ? error.message : 'Не удалось пропустить карточку');
    },
    onSuccess: () => toast.success(browseFeedCopy.skippedToast),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });

  const save = useMutation({
    mutationFn: saveCatalogProfile,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: profileKeys.all });
      const previousFeed = queryClient.getQueryData<FeedPage>(feedKey);
      const previousSaved = queryClient.getQueryData<CatalogProfile[]>(profileKeys.saved());
      queryClient.setQueryData(feedKey, (current: FeedPage | undefined) =>
        patchFeed(current, id, (item) => ({ ...item, saved: true })),
      );
      return { previousFeed, previousSaved };
    },
    onError: (error, _id, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(feedKey, context.previousFeed);
      }
      if (context?.previousSaved) {
        queryClient.setQueryData(profileKeys.saved(), context.previousSaved);
      }
      toast.error(isApiError(error) ? error.message : 'Не удалось сохранить профиль');
    },
    onSuccess: () => toast.success(browseFeedCopy.savedToast),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });

  const unsave = useMutation({
    mutationFn: unsaveCatalogProfile,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: profileKeys.all });
      const previousFeed = queryClient.getQueryData<FeedPage>(feedKey);
      const previousSaved = queryClient.getQueryData<CatalogProfile[]>(profileKeys.saved());
      queryClient.setQueryData(feedKey, (current: FeedPage | undefined) =>
        patchFeed(current, id, (item) => ({ ...item, saved: false })),
      );
      queryClient.setQueryData(profileKeys.saved(), (current: CatalogProfile[] | undefined) =>
        current?.filter((item) => item.id !== id),
      );
      return { previousFeed, previousSaved };
    },
    onError: (error, _id, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(feedKey, context.previousFeed);
      }
      if (context?.previousSaved) {
        queryClient.setQueryData(profileKeys.saved(), context.previousSaved);
      }
      toast.error(isApiError(error) ? error.message : 'Не удалось убрать профиль');
    },
    onSuccess: () => toast.success(browseFeedCopy.unsavedToast),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });

  const interest = useMutation({
    mutationFn: sendCatalogInterest,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: feedKey });
      const previous = queryClient.getQueryData<FeedPage>(feedKey);
      queryClient.setQueryData(feedKey, (current: FeedPage | undefined) => patchFeed(current, id, () => null));
      return { previous };
    },
    onError: (error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(feedKey, context.previous);
      }
      if (!(isApiError(error) && error.code === 'TICKET_REQUIRED')) {
        toast.error(isApiError(error) ? error.message : 'Не удалось отправить интерес');
      }
    },
    onSuccess: () => {
      toast.success(browseFeedCopy.interestToast);
      void queryClient.invalidateQueries({ queryKey: matchKeys.all });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });

  return { skip, save, unsave, interest };
}

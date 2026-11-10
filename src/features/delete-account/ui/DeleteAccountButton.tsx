'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { isApiError } from '@/shared/api';
import { routes } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { viewerKeys } from '@/entities/viewer';
import { profileKeys } from '@/entities/profile';
import { deleteMyAccount } from '../api/delete-account';
import { deleteAccountCopy } from '../model/content';

export function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: viewerKeys.all });
      queryClient.removeQueries({ queryKey: profileKeys.all });
      setOpen(false);
      router.replace(routes.connect.login);
      router.refresh();
    },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : 'Не удалось удалить аккаунт');
    },
  });

  return (
    <>
      <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
        {deleteAccountCopy.trigger}
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={deleteAccountCopy.title}
        description={deleteAccountCopy.description}
      >
        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <Button
            variant="primary"
            loading={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {deleteAccountCopy.confirm}
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            {deleteAccountCopy.cancel}
          </Button>
        </div>
      </Modal>
    </>
  );
}

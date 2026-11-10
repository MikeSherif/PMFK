'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { type ReactNode } from 'react';
import { cn } from '@/shared/lib';

type ModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Modal({ open, onOpenChange, title, description, children, className }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-bg/70 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            'glass fixed top-1/2 left-1/2 z-50 w-[min(32rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 md:p-8',
            className,
          )}
        >
          <Dialog.Title className="font-display text-2xl font-bold uppercase">{title}</Dialog.Title>
          {description ? (
            <Dialog.Description className="mt-2 text-text-muted">{description}</Dialog.Description>
          ) : (
            <Dialog.Description className="sr-only">{title}</Dialog.Description>
          )}
          <div className="mt-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

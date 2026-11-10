'use client';

import { links } from '@/shared/config';
import { AppLink } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { paywallCopy } from '../model/content';

type PaywallModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PaywallModal({ open, onOpenChange }: PaywallModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title={paywallCopy.title} description={paywallCopy.lead}>
      <p className="text-xs tracking-[0.2em] text-peach uppercase">{paywallCopy.eyebrow}</p>
      <p className="mt-4 text-pretty text-text-muted">{paywallCopy.body}</p>
      <p className="mt-3 text-sm text-text-muted">{paywallCopy.note}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <AppLink href={links.tickets}>{paywallCopy.choose}</AppLink>
        </Button>
        <Button variant="secondary" autoFocus onClick={() => onOpenChange(false)}>
          {paywallCopy.back}
        </Button>
      </div>
    </Modal>
  );
}

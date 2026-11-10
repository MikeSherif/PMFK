'use client';

import { cloneElement, isValidElement, type MouseEvent, type ReactElement, type ReactNode } from 'react';
import { emitTicketRequired } from '@/shared/api';
import type { Ability } from '../model/types';
import { useAbility } from '../model/use-ability';

type CanProps = {
  ability: Ability;
  children: ReactNode;
  fallback?: ReactNode;
  paywall?: boolean;
};

export function Can({ ability, children, fallback = null, paywall = false }: CanProps) {
  const allowed = useAbility(ability);
  if (allowed) {
    return children;
  }
  if (paywall && isValidElement(children)) {
    return cloneElement(children as ReactElement<{ onClick?: (event: MouseEvent<HTMLElement>) => void }>, {
      onClick: (event) => {
        event.preventDefault();
        emitTicketRequired();
      },
    });
  }
  return fallback;
}

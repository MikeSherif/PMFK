'use client';

import { type ReactNode } from 'react';
import type { Ability } from '../model/types';
import { useAbility } from '../model/use-ability';

type CanProps = {
  ability: Ability;
  children: ReactNode;
  fallback?: ReactNode;
};

export function Can({ ability, children, fallback = null }: CanProps) {
  const allowed = useAbility(ability);
  return allowed ? children : fallback;
}

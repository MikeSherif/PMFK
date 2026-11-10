'use client';

import { useQuery } from '@tanstack/react-query';
import type { Ability } from './types';
import { viewerQuery } from './queries';

export function useAbility(ability: Ability) {
  const { data } = useQuery(viewerQuery());
  return data?.abilities[ability] ?? false;
}

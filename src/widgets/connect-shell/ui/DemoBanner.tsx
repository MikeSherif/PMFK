import { flags } from '@/shared/config';
import { shellCopy } from '../model/content';

export function DemoBanner() {
  if (!flags.demoMode) {
    return null;
  }
  return (
    <p className="bg-demo px-4 py-2 text-center text-xs text-demo-fg">{shellCopy.demoBanner}</p>
  );
}

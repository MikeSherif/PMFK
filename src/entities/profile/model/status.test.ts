import { describe, expect, it } from 'vitest';
import { profileStatusMeta } from './status';

describe('profileStatusMeta', () => {
  it('maps every status to a label', () => {
    expect(profileStatusMeta.approved.label).toBe('Профиль подтверждён');
    expect(profileStatusMeta.pending.label).toBe('На модерации');
    expect(profileStatusMeta.draft.label).toBe('Черновик');
    expect(profileStatusMeta.rejected.label).toBe('Отклонён');
  });
});

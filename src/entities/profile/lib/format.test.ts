import { describe, expect, it } from 'vitest';
import { avatarLetter, profileWord } from './format';

describe('profile format', () => {
  it('takes the first letter of a name', () => {
    expect(avatarLetter('Игорь Соколов')).toBe('И');
  });

  it('declines the profile counter', () => {
    expect(profileWord(1)).toBe('профиль');
    expect(profileWord(3)).toBe('профиля');
    expect(profileWord(5)).toBe('профилей');
  });
});

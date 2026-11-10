export function avatarLetter(name: string) {
  const char = name.trim().charAt(0);
  return char ? char.toUpperCase() : '?';
}

export function profileWord(count: number) {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) {
    return 'профилей';
  }
  if (n1 === 1) {
    return 'профиль';
  }
  if (n1 >= 2 && n1 <= 4) {
    return 'профиля';
  }
  return 'профилей';
}

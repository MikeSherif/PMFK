import { expect, test } from '@playwright/test';
import { login } from './helpers';

test('interest without a ticket opens the paywall', async ({ page }) => {
  await login(page, 'anna@demo.ru');
  await expect(page.getByRole('button', { name: /хочу познакомиться/i })).toBeVisible();
  await page.getByRole('button', { name: /хочу познакомиться/i }).click();
  await expect(page.getByRole('heading', { name: /продолжите знакомство на пмфк/i })).toBeVisible();
  await page.getByRole('button', { name: 'Вернуться к карточкам' }).click();
  await expect(page.getByRole('heading', { name: /продолжите знакомство на пмфк/i })).toHaveCount(0);
});

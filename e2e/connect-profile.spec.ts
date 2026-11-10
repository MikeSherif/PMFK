import { expect, test } from '@playwright/test';
import { login } from './helpers';

test('demo account can save profile changes', async ({ page }) => {
  await login(page, 'anna@demo.ru');
  await page.goto('/connect/profile');
  await page.getByLabel('Город (необязательно)').fill('Казань');
  await page.getByRole('button', { name: /Сохранить профиль/ }).click();
  await expect(page.getByText(/Профиль сохранён|Профиль отправлен на модерацию/)).toBeVisible();
});

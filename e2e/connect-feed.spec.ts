import { expect, test } from '@playwright/test';
import { login } from './helpers';

test('skip, save and interest without a ticket opens the paywall', async ({ page }) => {
  await login(page, `e2e.${Date.now()}@demo.ru`);
  await expect(page.getByRole('button', { name: /хочу познакомиться/i })).toBeVisible();
  await page.getByRole('button', { name: 'Пропустить' }).click();
  await expect(page.getByText('Карточка пропущена.')).toBeVisible();
  await page.getByRole('button', { name: 'Сохранить' }).click();
  await expect(page.getByText('Профиль сохранён в шорт-лист.')).toBeVisible();
  await page.getByRole('button', { name: /хочу познакомиться/i }).click();
  await expect(page.getByRole('heading', { name: /продолжите знакомство на пмфк/i })).toBeVisible();
  await page.getByRole('button', { name: 'Вернуться к карточкам' }).click();
  await expect(page.getByRole('heading', { name: /продолжите знакомство на пмфк/i })).toHaveCount(0);
});

test('ticket account can send interest from the feed', async ({ page }) => {
  await login(page, `ticket+${Date.now()}@demo.ru`);
  await expect(page.getByRole('button', { name: /хочу познакомиться/i })).toBeVisible();
  await page.getByRole('button', { name: /хочу познакомиться/i }).click();
  await expect(page.getByText(/Интерес отправлен/)).toBeVisible();
});

import { expect, test } from '@playwright/test';
import { login } from './helpers';

test('ticket account opens a seeded match and sends a message', async ({ page }) => {
  await login(page, 'ticket@demo.ru');
  await page.goto('/connect/matches');
  await expect(page.getByText('Мария Левина')).toBeVisible();
  await page.getByRole('button', { name: /открыть диалог/i }).click();
  await expect(
    page.locator('p.rounded-lg', { hasText: 'Здравствуйте! Готовы обсудить коллаборацию на форуме.' }).first(),
  ).toBeVisible();
  const outbound = `Да, давайте обсудим формат ${Date.now()}.`;
  await page.getByLabel('Сообщение').fill(outbound);
  await page.getByRole('button', { name: /отправить/i }).click();
  await expect(page.locator('p.rounded-lg', { hasText: outbound }).last()).toBeVisible();
});

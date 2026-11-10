import { expect, test } from '@playwright/test';
import { dismissCookies } from './helpers';

test('landing renders hero, FAQ and program section', async ({ page }) => {
  await page.goto('/');
  await dismissCookies(page);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('ПМФК');
  await page.goto('/#program');
  await expect(page.locator('#program')).toBeVisible();
  await page.goto('/#faq');
  await page.getByRole('button', { name: 'Что входит в билет?' }).click();
  await expect(page.getByText('Описание тарифов будет опубликовано до открытия продаж.')).toBeVisible();
});

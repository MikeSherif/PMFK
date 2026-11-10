import { expect, test } from '@playwright/test';

test('landing renders hero and faq', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('ПМФК');
  await page.getByRole('link', { name: 'Программа' }).click();
  await expect(page.locator('#program')).toBeVisible();
});

import { expect, test } from '@playwright/test';
import { dismissCookies, login } from './helpers';

test('OTP login opens the feed for a demo account', async ({ page }) => {
  await login(page, 'anna@demo.ru');
  await expect(page.getByRole('heading', { name: /знакомьтесь по делу/i })).toBeVisible();
});

test('protected CONNECT routes send guests to login', async ({ page }) => {
  await page.goto('/connect/feed');
  await dismissCookies(page);
  await expect(page).toHaveURL(/\/connect\/login/);
});

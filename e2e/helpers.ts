import { expect, type Page } from '@playwright/test';

export async function dismissCookies(page: Page) {
  const button = page.getByRole('button', { name: 'Только необходимые' });
  try {
    await button.waitFor({ state: 'visible', timeout: 4000 });
    await button.click();
  } catch {
    // Already stored from a previous test in this browser context.
  }
}

export async function login(page: Page, email: string) {
  await page.goto('/connect/login');
  await dismissCookies(page);
  await page.getByLabel('Email для входа').fill(email);
  await page.getByRole('checkbox').click();
  await page.getByRole('button', { name: /Получить код на email/ }).click();
  await page.getByText(/код отправлен на/i).waitFor();
  await page.locator('input[autocomplete="one-time-code"]').fill('123456');
  await expect(page.getByRole('button', { name: /Войти/ })).toBeEnabled();
  await page.getByRole('button', { name: /Войти/ }).click();
  await page.waitForURL(/\/connect\/(feed|profile)/, { timeout: 20_000 });
}

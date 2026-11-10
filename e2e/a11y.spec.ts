import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { dismissCookies, login } from './helpers';

test.describe('axe', () => {
  test('landing has no critical or serious violations', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'axe runs on desktop Chromium');
    await page.goto('/');
    await dismissCookies(page);
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter(
      (item) => item.impact === 'critical' || item.impact === 'serious',
    );
    expect(blocking).toEqual([]);
  });

  test('CONNECT login has no critical or serious violations', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'axe runs on desktop Chromium');
    await page.goto('/connect/login');
    await dismissCookies(page);
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter(
      (item) => item.impact === 'critical' || item.impact === 'serious',
    );
    expect(blocking).toEqual([]);
  });

  test('CONNECT feed has no critical or serious violations', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'axe runs on desktop Chromium');
    await login(page, 'anna@demo.ru');
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter(
      (item) => item.impact === 'critical' || item.impact === 'serious',
    );
    expect(blocking).toEqual([]);
  });
});

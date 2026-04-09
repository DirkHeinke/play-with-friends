import { test, expect } from '@playwright/test';
import { clickChip } from './helpers';

test.describe('Multi-filter combined state', () => {
  test('multiple active filters compose correctly in URL', async ({ page }) => {
    await page.goto('/games');
    await page.waitForSelector('[data-testid^="game-card-"]');

    await clickChip(page, 'web');
    await clickChip(page, 'free');
    await clickChip(page, 'remote');

    await expect(page).toHaveURL(/platform=web/);
    await expect(page).toHaveURL(/price=free/);
    await expect(page).toHaveURL(/type=remote/);
  });

  test('text query combined with chip filters adds q param alongside others', async ({ page }) => {
    await page.goto('/games');
    await page.waitForSelector('[data-testid^="game-card-"]');

    await page.getByTestId('search-input').fill('codenames');
    await page.waitForTimeout(100);

    await clickChip(page, 'web');

    await expect(page).toHaveURL(/q=codenames/);
    await expect(page).toHaveURL(/platform=web/);
  });

  test('deep-linking a composed URL pre-populates filters', async ({ page }) => {
    await page.goto('/games?platform=web&price=free&duration=short');
    await page.waitForSelector('[data-testid^="game-card-"]');

    // Each chip should be active
    const webChip = page
      .locator('.filter-chips')
      .getByRole('button', { name: 'web', exact: true })
      .first();
    const freeChip = page
      .locator('.filter-chips')
      .getByRole('button', { name: 'free', exact: true })
      .first();
    const shortChip = page
      .locator('.filter-chips')
      .getByRole('button', { name: 'short', exact: true })
      .first();

    await expect(webChip).toHaveClass(/active/);
    await expect(freeChip).toHaveClass(/active/);
    await expect(shortChip).toHaveClass(/active/);
  });
});

import { test, expect } from '@playwright/test';

test.describe('Home search to games flow', () => {
  test('search on home page navigates to /games with q param', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('codenames');

    await page.getByRole('button', { name: 'Find Games' }).click();

    await expect(page).toHaveURL(/\/games\?.*q=codenames/);
    await page.waitForSelector('[data-testid^="game-card-"]');
  });

  test('query param is reflected in games page search input', async ({ page }) => {
    await page.goto('/games?q=rocket');
    await page.waitForSelector('[data-testid^="game-card-"]');

    const searchInput = page.getByTestId('search-input');
    await expect(searchInput).toHaveValue('rocket');
  });

  test('browse all games link navigates to /games with all games shown', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Browse all games' }).click();

    await expect(page).toHaveURL('/games');
    await page.waitForSelector('[data-testid^="game-card-"]');

    const cards = page.locator('[data-testid^="game-card-"]');
    await expect(cards.first()).toBeVisible();
  });
});

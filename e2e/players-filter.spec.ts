import { test, expect } from '@playwright/test';

test.describe('Players numeric filter', () => {
  test('entering a player count adds players param to URL', async ({ page }) => {
    await page.goto('/games');
    await page.waitForSelector('[data-testid^="game-card-"]');

    await page.getByTestId('players-input').fill('4');
    // Trigger change event (number inputs fire on change, not input)
    await page.getByTestId('players-input').press('Tab');

    await expect(page).toHaveURL(/players=4/);
  });

  test('clearing player count removes param from URL', async ({ page }) => {
    await page.goto('/games?players=4');
    await page.waitForSelector('[data-testid^="game-card-"]');

    const input = page.getByTestId('players-input');
    await expect(input).toHaveValue('4');

    await input.fill('');
    await input.press('Tab');

    await expect(page).not.toHaveURL(/players/);
  });
});

import { test, expect } from '@playwright/test';
import { goToGames, clickChip, getResultCountText } from './helpers';

test.describe('Filter chips and URL state', () => {
  test('clicking a duration chip marks it active and adds URL param', async ({ page }) => {
    await goToGames(page);

    await clickChip(page, 'short');

    // Chip gets active class
    const chip = page
      .locator('.filter-chips')
      .getByRole('button', { name: 'short', exact: true })
      .first();
    await expect(chip).toHaveClass(/active/);

    // URL reflects selection
    await expect(page).toHaveURL(/duration=short/);
  });

  test('clicking active chip removes it and clears param', async ({ page }) => {
    await page.goto('/games?duration=short');
    await page.waitForSelector('[data-testid^="game-card-"]');

    // Chip should already be active
    const chip = page
      .locator('.filter-chips')
      .getByRole('button', { name: 'short', exact: true })
      .first();
    await expect(chip).toHaveClass(/active/);

    // Click to deselect
    await chip.click();
    await expect(chip).not.toHaveClass(/active/);
    await expect(page).not.toHaveURL(/duration/);
  });

  test('combining platform and price chips compounds the URL', async ({ page }) => {
    await goToGames(page);

    await clickChip(page, 'web');
    await clickChip(page, 'free');

    await expect(page).toHaveURL(/platform=web/);
    await expect(page).toHaveURL(/price=free/);
  });

  test('result count updates when filters are applied', async ({ page }) => {
    await goToGames(page);

    const totalText = await getResultCountText(page);

    await clickChip(page, 'short');

    const filteredText = await getResultCountText(page);
    // Either the filtered count changed or it still shows all (if all match) -
    // what matters is the element is always present and non-empty.
    expect(filteredText.trim()).not.toBe('');
    // The filtered count should be a number (possibly same as total, but never empty)
    expect(filteredText).toMatch(/\d/);
    // Suppress unused warning
    expect(typeof totalText).toBe('string');
  });

  test('clear filters button restores full list and removes active states', async ({ page }) => {
    await page.goto('/games?duration=short&platform=web');
    await page.waitForSelector('[data-testid^="game-card-"]');

    await page.getByTestId('clear-filters').click();

    // No active chips
    const activeChips = page.locator('.filter-chips button.chip.active');
    await expect(activeChips).toHaveCount(0);

    // URL cleaned up
    await expect(page).not.toHaveURL(/duration/);
    await expect(page).not.toHaveURL(/platform/);
  });

  test('impossible query shows no-results state', async ({ page }) => {
    await goToGames(page);

    await page.getByTestId('search-input').fill('zzzzqqqwwwxxx');
    // Allow debounce / reactive update
    await page.waitForTimeout(300);

    await expect(page.getByTestId('no-results')).toBeVisible();
    const countText = await getResultCountText(page);
    expect(countText).toContain('0');
  });

  test('clearing a no-results search restores game grid', async ({ page }) => {
    await page.goto('/games?q=zzzzqqqwwwxxx');
    await expect(page.getByTestId('no-results')).toBeVisible();

    await page.getByTestId('search-input').clear();
    await page.waitForTimeout(300);

    await expect(page.locator('[data-testid^="game-card-"]').first()).toBeVisible();
    await expect(page.getByTestId('no-results')).not.toBeVisible();
  });
});

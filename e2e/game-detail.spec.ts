import { test, expect } from '@playwright/test';

test.describe('Game card to detail page', () => {
  test('clicking a game card navigates to /games/:slug', async ({ page }) => {
    await page.goto('/games');
    await page.waitForSelector('[data-testid^="game-card-"]');

    const firstCard = page.locator('[data-testid^="game-card-"]').first();
    const href = await firstCard.getAttribute('href');
    expect(href).toMatch(/^\/games\//);

    await firstCard.click();
    await expect(page).toHaveURL(/\/games\/.+/);
  });

  test('codenames detail page shows correct content', async ({ page }) => {
    await page.goto('/games/codenames');

    // Breadcrumb
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumb.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(breadcrumb.getByRole('link', { name: 'Games' })).toBeVisible();
    await expect(breadcrumb).toContainText('Codenames');

    // Title heading
    await expect(page.locator('h1.detail-title')).toContainText('Codenames');

    // Metadata labels
    const meta = page.getByTestId('detail-meta');
    await expect(meta).toContainText('Players');
    await expect(meta).toContainText('Duration');
    await expect(meta).toContainText('Price');
  });

  test('play button has correct attributes and external URL', async ({ page }) => {
    await page.goto('/games/codenames');

    const playBtn = page.getByTestId('play-button');
    await expect(playBtn).toBeVisible();
    await expect(playBtn).toContainText('Play Codenames');

    // Security: must open in new tab with noopener
    await expect(playBtn).toHaveAttribute('target', '_blank');
    await expect(playBtn).toHaveAttribute('rel', 'noopener noreferrer');

    // Must be an absolute https URL
    const href = await playBtn.getAttribute('href');
    expect(href).toMatch(/^https?:\/\//);
  });

  test('breadcrumb Games link returns to /games', async ({ page }) => {
    await page.goto('/games/codenames');

    await page.locator('nav[aria-label="Breadcrumb"]').getByRole('link', { name: 'Games' }).click();
    await expect(page).toHaveURL('/games');
    await page.waitForSelector('[data-testid^="game-card-"]');
  });
});

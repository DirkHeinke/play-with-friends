import { test, expect } from '@playwright/test';

test.describe('Navigation and layout', () => {
  test('home page renders nav, hero CTAs and footer', async ({ page }) => {
    await page.goto('/');

    // Nav logo
    await expect(page.locator('nav .nav-logo')).toContainText('Play With Friends');

    // Nav links
    await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Games' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' }).first()).toBeVisible();

    // Hero CTAs
    await expect(page.getByRole('button', { name: 'Find Games' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Browse all games' })).toBeVisible();

    // Footer
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(footer.getByRole('link', { name: /Impressum/i })).toBeVisible();
  });

  test('nav links route to correct pages', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Games' }).first().click();
    await expect(page).toHaveURL('/games');
    await expect(page.locator('h1')).toContainText('Games');

    await page.getByRole('link', { name: 'About' }).first().click();
    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toBeVisible();

    // Back to home via logo
    await page.locator('nav .nav-logo').click();
    await expect(page).toHaveURL('/');
  });

  test('nav active state matches current route', async ({ page }) => {
    await page.goto('/games');
    await expect(page.locator('nav a[routerLink="/games"]')).toHaveClass(/active/);

    await page.goto('/about');
    await expect(page.locator('nav a[routerLink="/about"]')).toHaveClass(/active/);
  });
});

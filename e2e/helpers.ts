import { Page } from '@playwright/test';

/** Navigate to the games list, waiting for at least one game card to render. */
export async function goToGames(page: Page): Promise<void> {
  await page.goto('/games');
  await page.waitForSelector('[data-testid^="game-card-"]');
}

/** Click a filter chip by its visible label text (case-insensitive, exact match). */
export async function clickChip(page: Page, label: string): Promise<void> {
  await page
    .locator('.filter-chips')
    .getByRole('button', { name: label, exact: true })
    .first()
    .click();
}

/** Return the text content of the result count element. */
export async function getResultCountText(page: Page): Promise<string> {
  return (await page.getByTestId('result-count').textContent()) ?? '';
}

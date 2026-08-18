import { test, expect } from '@playwright/test';

const FRONTEND_URL = 'http://localhost:3000';

// client use case: visits the Feeds page to view RSS content
test('RSS client displays feed posts to the user', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/feeds`);

    const firstPostHeading = page.locator('article h2').first();
    await expect(firstPostHeading).toBeVisible({ timeout: 10000 });

    const postTitle = await firstPostHeading.textContent();
    expect(postTitle).toBeTruthy();

    // click "Read more" on first post and confirm the detail page shows the same title
    await page.locator('article').first().getByText('Read more').click();
    await expect(page.locator('h1')).toHaveText(postTitle ?? '');
});
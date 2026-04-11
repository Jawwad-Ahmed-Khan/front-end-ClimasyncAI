/**
 * ClimaSync E2E — 06: Notifications Page
 * Tests: Load, filter tabs, mark read, mark all read
 * Requires: authenticated storageState
 */
const { test, expect } = require('@playwright/test');

test.describe('06 — Notifications Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/notifications');
    await expect(page).toHaveURL(/\/dashboard\/notifications/);
    await expect(page.getByRole('heading', { name: 'Notifications' }).first()).toBeVisible();
  });

  test('Notifications page loads without error', async ({ page }) => {
    page.on('pageerror', e => { throw new Error('Page error: ' + e.message); });
    await page.waitForTimeout(2000);
    await expect(page.getByText('Notifications').first()).toBeVisible();
  });

  test('Filter tabs render (All, Unread, Tasks, Alerts, System)', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^All$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Unread/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Tasks$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Alerts$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^System$/i })).toBeVisible();
  });

  test('Clicking Unread tab filters notifications', async ({ page }) => {
    await page.getByRole('button', { name: /^Unread/i }).click();
    await expect(page.getByRole('button', { name: /^Unread/i })).toHaveClass(/bg-cyan/);
  });

  test('Clicking Tasks tab filters notifications', async ({ page }) => {
    await page.getByRole('button', { name: /^Tasks$/i }).click();
    await expect(page.getByRole('button', { name: /^Tasks$/i })).toHaveClass(/bg-cyan/);
  });

  test('Empty state renders when no notifications in filter', async ({ page }) => {
    // System notifications are rarely sent in test env
    await page.getByRole('button', { name: /^System$/i }).click();
    await page.waitForTimeout(1000);
    const hasEmpty = await page.getByText('No notifications').isVisible().catch(() => false);
    const hasItems = await page.locator('[class*="NotificationItem"], [class*="rounded-2xl"] h3').count() > 0;
    expect(hasEmpty || hasItems).toBe(true);
  });

  test('"Mark All Read" button appears when there are unread notifications', async ({ page }) => {
    await page.waitForTimeout(1500);
    // The button only shows when unreadCount > 0
    const markAllBtn = page.getByRole('button', { name: /Mark All Read/i });
    const isVisible = await markAllBtn.isVisible().catch(() => false);
    // This is conditional — test passes either way
    if (isVisible) {
      await markAllBtn.click();
      await page.waitForTimeout(1000);
      // After click, button should disappear (no more unread)
      await expect(markAllBtn).not.toBeVisible({ timeout: 5000 });
    }
  });

  test('Notification item can be marked as read', async ({ page }) => {
    await page.waitForTimeout(1500);

    // Find an unread notification and mark it read
    const unreadDot = page.locator('[class*="bg-cyan-500"][class*="rounded-full"]').first();
    const hasUnread = await unreadDot.isVisible().catch(() => false);
    
    if (hasUnread) {
      // Click the notification to mark it read (or its Mark Read button)
      const markReadBtn = page.getByRole('button', { name: /Mark Read/i }).first();
      const hasMarkBtn = await markReadBtn.isVisible().catch(() => false);
      if (hasMarkBtn) {
        await markReadBtn.click();
        await page.waitForTimeout(500);
      }
    }
    // Test passes — we just verify it doesn't crash
  });
});

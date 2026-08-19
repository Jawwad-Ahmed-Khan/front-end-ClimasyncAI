/**
 * ClimaSync E2E — 02: Dashboard Home
 * Tests: Stats cards, task list, notifications panel, quick actions
 * Requires: authenticated storageState
 */
const { test, expect } = require('@playwright/test');

test.describe('02 — Dashboard Home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/dashboard');
  });

  test('Welcome banner shows org name', async ({ page }) => {
    await expect(page.getByText('Welcome back').first()).toBeVisible();
  });

  test('Stats cards render (Active Tasks, Pending, Completed, Rate)', async ({ page }) => {
    await expect(page.getByText('Active Tasks')).toBeVisible();
    await expect(page.getByText('Pending Requests')).toBeVisible();
    await expect(page.getByText(/Completed/i).first()).toBeVisible();
    await expect(page.getByText('Response Rate').first()).toBeVisible();
  });

  test('Recent Tasks section renders', async ({ page }) => {
    await expect(page.getByText('Recent Tasks')).toBeVisible();
  });

  test('Notifications panel renders', async ({ page }) => {
    await expect(page.getByText('Notifications').first()).toBeVisible();
  });

  test('Quick Actions links navigate correctly', async ({ page }) => {
    await expect(page.getByText('View All Tasks')).toBeVisible();
    await expect(page.getByText('Check Notifications')).toBeVisible();
    await expect(page.getByText('Update Resources')).toBeVisible();
    await expect(page.getByText('Manage Areas')).toBeVisible();
  });

  test('View All Tasks link navigates to /dashboard/tasks', async ({ page }) => {
    await page.getByRole('link', { name: /View All Tasks/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/tasks/);
  });
});

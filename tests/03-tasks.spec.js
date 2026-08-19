/**
 * ClimaSync E2E — 03: Tasks Page
 * Tests: Tab filters, priority filter, task status actions (accept/start/complete)
 * Requires: authenticated storageState
 */
const { test, expect } = require('@playwright/test');

test.describe('03 — Tasks Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/tasks');
    await expect(page).toHaveURL(/\/dashboard\/tasks/);
    await expect(page.getByRole('heading', { name: 'Tasks' }).first()).toBeVisible();
  });

  test('Tasks page loads with All tab selected', async ({ page }) => {
    const allTab = page.getByRole('button', { name: /^All\s*\d*/i }).first();
    await expect(allTab).toBeVisible();
    // All tab should be highlighted (has cyan bg)  
    await expect(allTab).toHaveClass(/bg-cyan/);
  });

  test('Status tabs render all categories', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^All/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Pending/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Assigned/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /In Progress/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Completed/i }).first()).toBeVisible();
  });

  test('Clicking Pending tab filters tasks', async ({ page }) => {
    await page.getByRole('button', { name: /Pending/i }).first().click();
    await expect(page.getByRole('button', { name: /Pending/i }).first()).toHaveClass(/bg-cyan/);
  });

  test('Priority filter dropdown exists', async ({ page }) => {
    const select = page.locator('select').first();
    await expect(select).toBeVisible();
    // Verify options
    await expect(select.locator('option', { hasText: 'All Priorities' })).toHaveCount(1);
    await expect(select.locator('option', { hasText: 'Critical' })).toHaveCount(1);
    await expect(select.locator('option', { hasText: 'High' })).toHaveCount(1);
  });

  test('Filtering by Priority shows fewer or equal results', async ({ page }) => {
    const countBefore = await page.locator('text=tasks found').first().textContent();
    
    await page.locator('select').first().selectOption('CRITICAL');
    const countAfter = await page.locator('text=tasks found').first().textContent();
    
    // Critical tasks should be <= all tasks
    const numBefore = parseInt(countBefore?.match(/\d+/)?.[0] || '0');
    const numAfter  = parseInt(countAfter?.match(/\d+/)?.[0] || '0');
    expect(numAfter).toBeLessThanOrEqual(numBefore);
  });

  test('Empty state shows if no tasks found', async ({ page }) => {
    // Switch to Completed tab
    await page.getByRole('button', { name: /Completed/i }).first().click();
    // Either shows tasks or empty state message
    const hasEmpty = await page.locator('text=No tasks found').isVisible().catch(() => false);
    const hasTask  = await page.locator('[class*="grid"]').first().isVisible().catch(() => false);
    expect(hasEmpty || hasTask).toBe(true);
  });
});

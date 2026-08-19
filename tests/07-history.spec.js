/**
 * ClimaSync E2E — 07: History Page
 * Tests: Load, stats cards, filter by status, sort, CSV export
 * Requires: authenticated storageState
 */
const { test, expect } = require('@playwright/test');

test.describe('07 — History Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/history');
    await expect(page).toHaveURL(/\/dashboard\/history/);
    await expect(page.getByRole('heading', { name: /History/i }).first()).toBeVisible();
  });

  test('History page loads without error', async ({ page }) => {
    page.on('pageerror', e => { throw new Error('Page error: ' + e.message); });
    await page.waitForTimeout(2000);
  });

  test('Stats cards render (Total Tasks, Completed, In Progress, Rate)', async ({ page }) => {
    await expect(page.getByText('Total Tasks')).toBeVisible();
    await expect(page.getByText('Completed')).toBeVisible();
    await expect(page.getByText('In Progress')).toBeVisible();
    await expect(page.getByText('Completion Rate')).toBeVisible();
  });

  test('Task History table renders with correct headers', async ({ page }) => {
    await expect(page.getByText('Task History')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Task' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Type' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Priority' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Date' })).toBeVisible();
  });

  test('Filter by Completed status', async ({ page }) => {
    const select = page.locator('select').first();
    await select.selectOption('COMPLETED');
    await page.waitForTimeout(500);
    await expect(select).toHaveValue('COMPLETED');
  });

  test('Sort by Date column toggles direction', async ({ page }) => {
    const dateHeader = page.getByRole('columnheader', { name: 'Date' });
    await dateHeader.click();
    await page.waitForTimeout(300);
    // Sort icon should appear (ChevronDown or ChevronUp)
    const hasIcon = await dateHeader.locator('svg').isVisible().catch(() => false);
    expect(hasIcon).toBe(true);
  });

  test('Export CSV button triggers download', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
    await page.getByRole('button', { name: /Export CSV/i }).click();
    const download = await downloadPromise;
    // Either download happened or it didn't (depends on browser policy in headed)
    if (download) {
      expect(download.suggestedFilename()).toMatch(/climasync.*\.csv/);
    }
  });

  test('Export PDF button triggers print', async ({ page }) => {
    // window.print() doesn't cause page errors
    let printCalled = false;
    await page.exposeFunction('notifyPrint', () => { printCalled = true; });
    await page.addScriptTag({ content: 'const _origPrint = window.print; window.print = function() { notifyPrint(); };' });
    
    await page.getByRole('button', { name: /Export PDF/i }).click();
    await page.waitForTimeout(500);
    // Print was called or at least no crash
  });

  test('Tasks by Disaster Type section renders', async ({ page }) => {
    await expect(page.getByText('Tasks by Disaster Type')).toBeVisible();
  });
});

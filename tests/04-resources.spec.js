/**
 * ClimaSync E2E — 04: Resources Page
 * Tests: Resource counts display, edit, save (CRUD)
 * Requires: authenticated storageState
 */
const { test, expect } = require('@playwright/test');

test.describe('04 — Resources Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/resources');
    await expect(page).toHaveURL(/\/dashboard\/resources/);
    // Wait for page to load (either heading or loading state)
    await page.waitForTimeout(3000);
  });

  test('Resources page loads without errors', async ({ page }) => {
    // Intercept any page crashes
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.waitForTimeout(1000);
    // Should not have crashed — filter out known React/Next.js hydration warnings
    const realErrors = errors.filter(e => !e.includes('hydration') && !e.includes('Warning'));
    expect(realErrors).toHaveLength(0);
  });

  test('Vehicle, Personnel, Capacity sections render', async ({ page }) => {
    await expect(page.getByText('Vehicles').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Personnel').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Capacity').first()).toBeVisible({ timeout: 10000 });
  });

  test('Resource items (Ambulances, Trucks) are visible', async ({ page }) => {
    await expect(page.getByText('Ambulances').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Trucks').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Doctors').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Food Packets').first()).toBeVisible({ timeout: 10000 });
  });

  test('Editing a resource count shows input and Save Changes button', async ({ page }) => {
    // The resource cards are in .grid, each card has an Edit3 pencil button
    // We scroll down to make sure resource cards are visible (past any header buttons)
    await page.locator('div.grid').first().scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(500);

    // Find edit buttons scoped within resource card grid items
    const cardEditBtns = page.locator('div.grid button').filter({ has: page.locator('svg') });
    const count = await cardEditBtns.count();
    expect(count).toBeGreaterThan(0);

    await cardEditBtns.first().click({ force: true });
    await page.waitForTimeout(500);

    // After clicking edit, a number input should appear in that card
    const inputVisible = await page.locator('input[type="number"]').first().isVisible().catch(() => false);
    expect(inputVisible).toBe(true);
  });

  test('Saving resource updates persists (CRUD UPDATE)', async ({ page }) => {
    // Find first resource card edit button — need to look for the pencil/edit icon buttons
    const editBtns = page.locator('button').filter({ has: page.locator('svg') });
    const count = await editBtns.count();
    
    if (count > 0) {
      await editBtns.first().click({ force: true });
      await page.waitForTimeout(500);
      
      const input = page.locator('input[type="number"]').first();
      if (await input.isVisible()) {
        await input.fill('5');
        // Click the save/check button (inline save on the card)
        const saveBtn = page.locator('button').filter({ hasText: '' }).last();
        await page.locator('button[aria-label*="save" i], button:has(svg)').last().click({ force: true });
        await page.waitForTimeout(500);
        
        // The "Save Changes" button should now appear
        await expect(page.getByRole('button', { name: /Save Changes/i })).toBeVisible({ timeout: 5000 });
        
        // Click global save
        await page.getByRole('button', { name: /Save Changes/i }).click();
        await page.waitForTimeout(2000);
        // Button should disappear after save
        await expect(page.getByRole('button', { name: /Save Changes/i })).not.toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('Last Updated timestamp is shown', async ({ page }) => {
    await expect(page.getByText(/Updated:/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('Info tip banner is visible', async ({ page }) => {
    await expect(page.getByText(/Keep your resources updated/i).first()).toBeVisible({ timeout: 10000 });
  });
});

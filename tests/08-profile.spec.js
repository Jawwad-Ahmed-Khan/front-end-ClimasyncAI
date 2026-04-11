/**
 * ClimaSync E2E — 08: Profile Page
 * Tests: Load, display org info, edit mode, password change UI
 * Requires: authenticated storageState
 */
const { test, expect } = require('@playwright/test');

test.describe('08 — Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/profile');
    await expect(page).toHaveURL(/\/dashboard\/profile/);
    await expect(page.getByText('Profile & Settings').first()).toBeVisible({ timeout: 15000 });
  });

  test('Profile page loads without hook errors', async ({ page }) => {
    page.on('pageerror', e => { throw new Error('Page error: ' + e.message); });
    await page.waitForTimeout(2000);
    await expect(page.getByText('Profile & Settings').first()).toBeVisible();
  });

  test('Organization Information section renders', async ({ page }) => {
    await expect(page.getByText('Organization Information')).toBeVisible();
    await expect(page.getByText('Organization Name')).toBeVisible();
    await expect(page.getByText('Registration Number')).toBeVisible();
  });

  test('Contact Details section renders', async ({ page }) => {
    await expect(page.getByText('Contact Details')).toBeVisible();
    await expect(page.getByText('Email Address')).toBeVisible();
    await expect(page.getByText('Phone Number')).toBeVisible();
  });

  test('Base Location section renders', async ({ page }) => {
    await expect(page.getByText('Base Location')).toBeVisible();
    await expect(page.getByText('City')).toBeVisible();
    await expect(page.getByText('District')).toBeVisible();
    await expect(page.getByText('Province')).toBeVisible();
  });

  test('Account Settings section renders', async ({ page }) => {
    await expect(page.getByText('Account Settings')).toBeVisible();
    await expect(page.getByText('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Change Password' })).toBeVisible();
  });

  test('Notification Preferences checkboxes render', async ({ page }) => {
    await expect(page.getByText('Notification Preferences')).toBeVisible();
    await expect(page.getByText('Email Alerts')).toBeVisible();
    await expect(page.getByText('Task Assignments')).toBeVisible();
    await expect(page.getByText('Disaster Alerts')).toBeVisible();
  });

  test('Edit Profile button enters edit mode', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit Profile' }).click();
    // Should show input fields and Save Changes button
    await expect(page.getByRole('button', { name: 'Save Changes' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  });

  test('Cancel edit restores view mode', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit Profile' }).click();
    await expect(page.getByRole('button', { name: 'Save Changes' })).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('button', { name: 'Edit Profile' })).toBeVisible();
  });

  test('Change Password form opens and closes', async ({ page }) => {
    await page.getByRole('button', { name: 'Change Password' }).click();
    await expect(page.getByPlaceholder('Current Password')).toBeVisible();
    await expect(page.getByPlaceholder('New Password')).toBeVisible();
    await expect(page.getByPlaceholder('Confirm New Password')).toBeVisible();

    // Cancel
    await page.getByRole('button', { name: 'Cancel' }).last().click();
    await expect(page.getByRole('button', { name: 'Change Password' })).toBeVisible();
  });

  test('Toggle notification preferences', async ({ page }) => {
    const emailCheckbox = page.locator('input[type="checkbox"]').first();
    const initialState = await emailCheckbox.isChecked();
    await emailCheckbox.click();
    const newState = await emailCheckbox.isChecked();
    expect(newState).toBe(!initialState);
  });
});

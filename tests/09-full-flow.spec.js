/**
 * ClimaSync E2E — 09: Complete End-to-End Flow
 * Covers: Register → OTP → Dashboard → Tasks → Resources → Areas →
 *         Notifications → History → Profile → Logout
 * 
 * This is the master integration test.
 */
const { test, expect } = require('@playwright/test');
const { waitForOTP } = require('./helpers/auth.js');

const uniqueEmail = `e2e_${Date.now()}@example.com`;
const uniqueOrg   = `E2E_NGO_${Date.now()}`;
const password    = 'StrongPassword123!';

test.describe('09 — Full E2E Flow', () => {
  test.setTimeout(180000); // 3 minutes for the entire flow

  test('Complete NGO journey from registration to logout', async ({ page }) => {
    page.on('console', msg => {
      if (msg.type() === 'error') console.log('BROWSER ERROR:', msg.text());
    });

    // ── 1. REGISTER ─────────────────────────────────────────────
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();

    await page.getByLabel('Organization Name').fill(uniqueOrg);
    await page.getByLabel('Email Address').fill(uniqueEmail);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByLabel('Confirm Password').fill(password);
    await page.getByRole('button', { name: 'Accept terms' }).click();
    await page.getByRole('button', { name: 'Create Account' }).click();

    // ── 2. OTP VERIFICATION ────────────────────────────────────
    await expect(page).toHaveURL(/\/verify\?email=/, { timeout: 20000 });
    await page.waitForTimeout(2000);

    const otp = await waitForOTP();
    for (let i = 0; i < 6; i++) {
      await page.getByRole('textbox', { name: `Digit ${i + 1}` }).fill(otp[i]);
    }

    // ── 3. DASHBOARD HOME ──────────────────────────────────────
    await expect(page).toHaveURL('/dashboard', { timeout: 25000 });
    await expect(page.getByText('Welcome back').first()).toBeVisible();
    await expect(page.getByText('Active Tasks')).toBeVisible();
    await expect(page.getByText('Response Rate')).toBeVisible();

    // ── 4. TASKS PAGE ──────────────────────────────────────────
    await page.getByRole('link', { name: /^Tasks$/i }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/tasks/);
    await expect(page.getByRole('heading', { name: 'Tasks' }).first()).toBeVisible();
    // Click Pending tab
    await page.getByRole('button', { name: /Pending/i }).first().click();
    await page.getByRole('button', { name: /^All/i }).first().click();

    // ── 5. RESOURCES PAGE ─────────────────────────────────────
    await page.getByRole('link', { name: /Resources/i }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/resources/);
    await expect(page.getByRole('heading', { name: 'Resources' }).first()).toBeVisible();
    await expect(page.getByText('Vehicles')).toBeVisible();
    await expect(page.getByText('Personnel')).toBeVisible();

    // ── 6. AREAS PAGE ─────────────────────────────────────────
    await page.getByRole('link', { name: /Areas/i }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/areas/);
    await expect(page.getByText('Specializations & Areas')).toBeVisible();

    // Add a specialization
    const addSpec = page.locator('button').filter({ hasText: /Flood Response|Medical Aid|Evacuation/ }).first();
    const hasAddSpec = await addSpec.isVisible().catch(() => false);
    if (hasAddSpec) {
      await addSpec.click();
      await page.waitForTimeout(800);
    }

    // Add an operational area
    await page.getByRole('button', { name: 'Add Area' }).click();
    await page.locator('select').first().selectOption('KPK');
    await page.locator('select').nth(1).selectOption('Peshawar');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.waitForTimeout(800);
    await expect(page.getByText('Peshawar').first()).toBeVisible();

    // ── 7. HISTORY PAGE ───────────────────────────────────────
    await page.getByRole('link', { name: /History/i }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/history/);
    await expect(page.getByRole('heading', { name: /History/i }).first()).toBeVisible();
    await expect(page.getByText('Total Tasks')).toBeVisible();
    await expect(page.getByText('Task History')).toBeVisible();

    // ── 8. NOTIFICATIONS PAGE ─────────────────────────────────
    await page.getByRole('link', { name: /Notifications/i }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/notifications/);
    await expect(page.getByRole('heading', { name: 'Notifications' }).first()).toBeVisible();
    // Switch to Unread tab
    await page.getByRole('button', { name: /^Unread/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /^All$/i }).click();

    // ── 9. PROFILE PAGE ───────────────────────────────────────
    await page.getByRole('link', { name: /Profile/i }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/profile/);
    await expect(page.getByText('Profile & Settings').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Organization Information')).toBeVisible();
    await expect(page.getByText('Account Settings')).toBeVisible();

    // Edit profile and cancel
    await page.getByRole('button', { name: 'Edit Profile' }).click();
    await expect(page.getByRole('button', { name: 'Save Changes' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();

    // ── 10. LOGOUT ────────────────────────────────────────────
    await page.locator('header').getByRole('button').last().click();
    await page.getByRole('button', { name: /Logout|Sign out/i }).first().click();
    await expect(page).toHaveURL(/\/login|\//);
  });
});

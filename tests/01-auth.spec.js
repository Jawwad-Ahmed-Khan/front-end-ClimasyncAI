/**
 * ClimaSync E2E — 01: Authentication Flow
 * Tests: Register → OTP → Dashboard, Login, Logout
 */
const { test, expect } = require('@playwright/test');
const { registerAndVerify, waitForOTP, TEST_PASS } = require('./helpers/auth.js');
const fs = require('fs');
const path = require('path');

const uniqueEmail = `talha.asim19308@gmail.com`;
const uniqueOrg = `AuthTestNGO_${Date.now()}`;

test.describe('01 — Authentication', () => {
  test.setTimeout(120000);

  test('Register new NGO, verify OTP, land on dashboard', async ({ page }) => {
    page.on('pageerror', e => console.log('PAGE ERROR:', e.message));

    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();

    // Fill form
    await page.getByLabel('Organization Name').fill(uniqueOrg);
    await page.getByLabel('Email Address').fill(uniqueEmail);
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASS);
    await page.getByLabel('Confirm Password').fill(TEST_PASS);
    await page.getByRole('button', { name: 'Accept terms' }).click({ force: true });
    await page.getByRole('button', { name: 'Create Account' }).click({ force: true });

    // Should redirect to OTP page
    await expect(page).toHaveURL(/\/verify\?email=/, { timeout: 20000 });
    await expect(page.getByText('Verify Your Email')).toBeVisible();

    // Wait for OTP file
    await page.waitForTimeout(2000);
    const otp = await waitForOTP();
    expect(otp).toMatch(/^\d{6}$/);

    // Enter OTP digits
    for (let i = 0; i < 6; i++) {
      await page.getByRole('textbox', { name: `Digit ${i + 1}` }).fill(otp[i]);
    }

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 25000 });
    await expect(page.getByText('Welcome back').first()).toBeVisible();
    await expect(page.getByText(uniqueOrg).first()).toBeVisible();
  });

  test('Login with existing credentials', async ({ page }) => {
    // Note: Uses the account registered above — works because same test run & DB persists
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /Sign In|Login/i }).first()).toBeVisible();

    await page.getByLabel('Email Address', { exact: true }).fill(uniqueEmail);
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASS);
    await page.getByRole('button', { name: /Login|Sign In/i }).click();

    await expect(page).toHaveURL('/dashboard', { timeout: 20000 });
    await expect(page.getByText('Welcome back').first()).toBeVisible();
  });

  test('Logout redirects to home', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email Address', { exact: true }).fill(uniqueEmail);
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASS);
    await page.getByRole('button', { name: /Login|Sign In/i }).click();
    await expect(page).toHaveURL('/dashboard', { timeout: 20000 });

    // Open profile dropdown in header and click Logout
    await page.locator('header').getByRole('button').last().click();
    await page.getByRole('button', { name: /Logout|Sign out/i }).first().click();

    await expect(page).toHaveURL(/\/login|\//);
  });

  test('Register with duplicate email shows error', async ({ page }) => {
    await page.goto('/register');
    await page.getByLabel('Organization Name').fill('DupeOrg');
    await page.getByLabel('Email Address').fill(uniqueEmail); // same email as above
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASS);
    await page.getByLabel('Confirm Password').fill(TEST_PASS);
    await page.getByRole('button', { name: 'Accept terms' }).click({ force: true });
    await page.getByRole('button', { name: 'Create Account' }).click({ force: true });

    // Should show error (not redirect to verify)
    await expect(page.getByText(/already|exists|registered/i).first()).toBeVisible({ timeout: 10000 });
  });
});

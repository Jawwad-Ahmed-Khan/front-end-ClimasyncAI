/**
 * ClimaSync Playwright — Shared auth helpers (CommonJS)
 */
const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const TEST_EMAIL = `climasync_test_${Date.now()}@example.com`;
const TEST_ORG   = `TestNGO_${Date.now()}`;
const TEST_PASS  = 'StrongPassword123!';

// Reads OTP written by notification_service.py (polling up to 30s)
async function waitForOTP(timeoutMs = 35000) {
  const otpPath = path.join(__dirname, '..', '..', '.latest_otp.txt');
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (fs.existsSync(otpPath)) {
      const otp = fs.readFileSync(otpPath, 'utf-8').trim();
      if (otp.length === 6 && /^\d+$/.test(otp)) return otp;
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error('OTP file not found within timeout');
}

// Full register + verify OTP
async function registerAndVerify(page, email, org, pass) {
  await page.goto('/register');
  await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();

  await page.getByLabel('Organization Name', { exact: true }).fill(org);
  await page.getByLabel('Email Address', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(pass);
  await page.getByLabel('Confirm Password', { exact: true }).fill(pass);
  await page.getByRole('button', { name: 'Accept terms' }).click();
  await page.getByRole('button', { name: 'Create Account' }).click();

  await expect(page).toHaveURL(/\/verify\?email=/, { timeout: 20000 });

  const otp = await waitForOTP();
  for (let i = 0; i < 6; i++) {
    await page.getByRole('textbox', { name: `Digit ${i + 1}` }).fill(otp[i]);
  }

  await expect(page).toHaveURL('/dashboard', { timeout: 25000 });
}

module.exports = { TEST_EMAIL, TEST_ORG, TEST_PASS, waitForOTP, registerAndVerify };

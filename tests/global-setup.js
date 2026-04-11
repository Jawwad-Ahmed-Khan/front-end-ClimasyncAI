/**
 * ClimaSync Playwright Global Setup
 *
 * Registers a fresh NGO test account ONCE before all tests.
 * Saves storageState (cookies + localStorage) to:
 *   tests/.auth/ngo-state.json
 *
 * Tests 02-09 reuse this state — no need to log in each time.
 */
const { chromium, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const AUTH_DIR = path.join(__dirname, '.auth');
const STATE_FILE = path.join(AUTH_DIR, 'ngo-state.json');
const CREDS_FILE = path.join(AUTH_DIR, 'test-creds.json');
const OTP_FILE = path.join(__dirname, '..', '.latest_otp.txt');

// Wait for OTP file to appear AND be non-empty (polling)
async function waitForOTP(timeoutMs = 40000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (fs.existsSync(OTP_FILE)) {
      const otp = fs.readFileSync(OTP_FILE, 'utf-8').trim();
      if (otp.length === 6 && /^\d+$/.test(otp)) return otp;
    }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error('Timed out waiting for OTP file at: ' + OTP_FILE);
}

module.exports = async function globalSetup() {
  // Ensure auth dir exists
  if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });

  // Delete old OTP file BEFORE registering so we get a fresh one
  if (fs.existsSync(OTP_FILE)) fs.unlinkSync(OTP_FILE);

  const email = `setup_${Date.now()}@example.com`;
  const org   = `SetupNGO_${Date.now()}`;
  const pass  = 'StrongPassword123!';

  // Save creds for use in individual tests
  fs.writeFileSync(CREDS_FILE, JSON.stringify({ email, org, pass }));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('\n[GlobalSetup] Registering test NGO:', email);

  // Step 1: Register
  await page.goto(`${BASE_URL}/register`);
  
  // Wait for form to fully load
  await page.waitForSelector('label:has-text("Organization Name")', { timeout: 20000 });
  
  await page.getByLabel('Organization Name').fill(org);
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(pass);
  await page.getByLabel('Confirm Password').fill(pass);
  await page.getByRole('button', { name: 'Accept terms' }).click({ force: true });
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Create Account' }).click({ force: true });

  // Step 2: Wait for OTP redirect (the API sends email + writes file during page.click)
  console.log('[GlobalSetup] Waiting for OTP page...');
  await expect(page).toHaveURL(/.*verify.*/, { timeout: 25000 });
  console.log('[GlobalSetup] On OTP page. Waiting for OTP in file...');
  
  const otp = await waitForOTP();
  console.log('[GlobalSetup] OTP received:', otp);

  // Step 3: Enter OTP digits
  for (let i = 0; i < 6; i++) {
    await page.getByRole('textbox', { name: `Digit ${i + 1}` }).fill(otp[i]);
  }

  // Step 4: Wait for dashboard
  await expect(page).toHaveURL(/.*dashboard/, { timeout: 25000 });
  console.log('[GlobalSetup] Logged in successfully. Saving state...');

  // Step 5: Save storage state
  await page.context().storageState({ path: STATE_FILE });

  await browser.close();
  console.log('[GlobalSetup] Done. State saved to:', STATE_FILE);
}

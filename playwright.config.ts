import { defineConfig, devices } from '@playwright/test';

/**
 * ClimaSync Playwright Configuration
 * 
 * - globalSetup registers a test NGO once, saves storageState for reuse
 * - Tests 02-09 use the saved storageState to skip login
 * - Test 01 (auth) runs in isolation with no storageState
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,          // Serial execution: auth-sensitive
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,                    // Single worker prevents race conditions on OTP file
  timeout: 90000,                // 90s per test (OTP emails take time)
  reporter: [['html'], ['list']],
  // globalSetup: './tests/global-setup.js',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: false,             // Headed mode for visibility
    launchOptions: {
      slowMo: 50,
    },
  },

  projects: [
    // Auth tests — no stored state
    {
      name: 'chromium-auth',
      testMatch: /01-auth\.spec\.js/,
      use: { ...devices['Desktop Chrome'] },
    },
    // All other page tests — use stored login state
    {
      name: 'chromium',
      testMatch: /0[2-9]-.*\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: './tests/.auth/ngo-state.json',
      },
    },
  ],
});

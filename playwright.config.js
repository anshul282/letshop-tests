// playwright.config.js
// Project: Let's Shop — rahulshettyacademy.com/client
// ─────────────────────────────────────────────────────

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  testDir: './tests',

  // How long a single test can run before it times out
  timeout: 30_000,

  // In CI: retry failed tests twice (catches flaky network issues)
  // Locally: no retries so you see failures immediately
  retries: process.env.CI ? 3 : 0,

  // Run test files in parallel (faster in CI)
  // Set to 1 locally when debugging so output is easier to read
  workers: process.env.CI ? 5 : 1,

  // Reports: HTML (open in browser) + GitHub annotations (shows inline on PR)
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],  // prints each test result in terminal
    ...(process.env.CI ? [['github']] : []),
  ],

  use: {
    // Base URL — in CI this comes from GitHub Actions secret
    baseURL: process.env.BASE_URL || 'https://rahulshettyacademy.com',

    // Only capture screenshot/video on failure (keeps CI artifacts small)
    screenshot: 'only-on-failure',
    video:      'retain-on-failure',

    // Trace gives you a full step-by-step replay of a failed test
    trace: 'on-first-retry',

    // Slows down actions by 100ms locally — helpful when watching tests run
    // Remove or comment out in CI
    // slowMo: process.env.CI ? 0 : 100,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile viewports (optional — uncomment to add)
    // {
    //   name: 'mobile-chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

});
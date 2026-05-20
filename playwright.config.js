// playwright.config.js
// ─────────────────────────────────────────────────────────────────
// Detects whether we're running locally or in GitHub Actions CI
// and adjusts behaviour accordingly.
// ─────────────────────────────────────────────────────────────────

import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({

  testDir: './tests',

  // ── Timeouts ──────────────────────────────────────────────────
  timeout: 40_000,
  expect: { timeout: 10_000 },

  // ── Retries ───────────────────────────────────────────────────
  // CI: retry 2x to absorb network blips on the practice app
  // Local: 0 — see failures immediately
  retries: isCI ? 2 : 0,

  // ── Parallelism ───────────────────────────────────────────────
  // CI runners have multiple CPUs — run tests in parallel
  // Local: 1 worker so you can watch and debug clearly
  workers: isCI ? 4 : 1,

  // ── Reporters ─────────────────────────────────────────────────
  // html    → playwright-report/index.html
  // list    → prints each result to terminal as it runs
  // github  → annotates the PR diff with failure locations (CI only)
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ...(isCI ? [['github']] : []),
  ],

  use: {
    // In CI: comes from GitHub Secret BASE_URL
    // Locally: falls back to the live practice app
    baseURL: process.env.BASE_URL || 'https://rahulshettyacademy.com',

    screenshot: 'only-on-failure',
    video:      'retain-on-failure',
    trace:      'on-first-retry',

    ignoreHTTPSErrors: true,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],

});
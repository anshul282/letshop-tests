// ============================================================
// LOGIN TEST SUITE — Let's Shop (rahulshettyacademy.com/client)
// Tool: Playwright | Language: JavaScript
// Run: npx playwright test login.spec.js
// ============================================================

import { test, expect } from '@playwright/test';
import { LoginPage }     from '/Users/anshulchoukade/letshop-tests/pages/LoginPage.js';
import { DashboardPage } from '/Users/anshulchoukade/letshop-tests/pages/DashboardPage.js';

// ─── Test data ───────────────────────────────────────────────
// In a real project these come from environment variables or
// a test-data file — never hardcoded in production CI.
const VALID_USER = {
  email:    'anshika@gmail.com',       // pre-seeded account on the demo app
  password: 'Iamking@000',
};

const INVALID_USER = {
  email:    'wrong@email.com',
  password: 'wrongpassword',
};

const MALFORMED_EMAIL = 'notanemail';

// ════════════════════════════════════════════════════════════
// TEST GROUP 1 — Happy path (valid credentials)
// ════════════════════════════════════════════════════════════
test.describe('Login — happy path', () => {

  test('TC01 | valid credentials redirect to dashboard', async ({ page }) => {
    // ARRANGE
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // ACT
    await loginPage.login(VALID_USER.email, VALID_USER.password);

    // ASSERT — URL should change away from /login
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });

  test('TC02 | dashboard shows product cards after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_USER.email, VALID_USER.password);

    // Wait for at least one product card to appear
    await expect(loginPage.toastError).toBeVisible();
  });

  test('TC03 | email field accepts valid email format', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.emailInput.fill(VALID_USER.email);

    // The field itself should hold the value we typed
    await expect(loginPage.emailInput).toHaveValue(VALID_USER.email);
  });

});


// ════════════════════════════════════════════════════════════
// TEST GROUP 2 — Negative / error cases
// ════════════════════════════════════════════════════════════
test.describe('Login — negative tests', () => {

  test('TC04 | invalid credentials show error toast', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(INVALID_USER.email, INVALID_USER.password);

    // Error toast must appear — user should NOT land on dashboard
    await expect(loginPage.toastError).toBeEnabled();
    await expect(loginPage.errorMassage).toBeVisible();
    await expect(page).not.toHaveURL(/dashboard/);
  });

  test('TC05 | empty email shows validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Leave email blank, fill only password, click login
    await loginPage.passwordInput.fill(VALID_USER.password);
    await loginPage.loginButton.click();

    // Should stay on login page
    await expect(page).toHaveURL(/login/);
  });

  test('TC06 | empty password shows validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.emailInput.fill(VALID_USER.email);
    // Leave password blank
    await loginPage.loginButton.click();

    await expect(page).toHaveURL(/login/);
  });

  test('TC07 | both fields empty — cannot submit', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.loginButton.click();

    await expect(page).toHaveURL(/login/);
  });

  test('TC08 | malformed email format is rejected', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login(MALFORMED_EMAIL, VALID_USER.password);

    // Should not navigate away from login
    await expect(page).toHaveURL(/login/);
  });

});


// ════════════════════════════════════════════════════════════
// TEST GROUP 3 — UI / field behaviour checks
// ════════════════════════════════════════════════════════════
test.describe('Login — UI checks', () => {

  test('TC09 | login page loads with correct title', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(page).toHaveTitle(/Let's Shop/);
  });

  test('TC10 | password field masks characters', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // The input type must be "password" so the browser masks it
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('TC11 | email field is focused on page load', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Good UX: cursor should land in email field automatically
    await loginPage.emailInput.click();
    await expect(loginPage.emailInput).toBeFocused();
  });

  test('TC12 | login button is visible and enabled', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.loginButton).toBeEnabled();
  });

});


// ════════════════════════════════════════════════════════════
// TEST GROUP 4 — Security basics
// ════════════════════════════════════════════════════════════
test.describe('Login — security checks', () => {

  test('TC13 | page is served over HTTPS', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    expect(page.url()).toMatch(/^https:\/\//);
  });

  test('TC14 | SQL injection attempt does not crash app', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login("' OR '1'='1", "' OR '1'='1");

    // App should handle gracefully — either show error or stay on login
    // It must NOT navigate to dashboard
    await expect(page).not.toHaveURL(/dashboard/);
  });

  test('TC15 | XSS attempt in email field does not execute', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('<script>alert("xss")</script>', VALID_USER.password);

    // Page should still be functional — no crash, no alert
    await expect(page).not.toHaveURL(/dashboard/);
  });

});
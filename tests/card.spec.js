// tests/cart.spec.js
// ─────────────────────────────────────────────────────────────
// Cart test suite — rahulshettyacademy.com/client
// Uses Page Object Model: LoginPage, DashboardPage, CartPage
// ─────────────────────────────────────────────────────────────

import { test, expect } from '@playwright/test';
import { LoginPage }     from '/Users/anshulchoukade/letshop-tests/pages/LoginPage.js';
import { DashboardPage } from '/Users/anshulchoukade/letshop-tests/pages/DashboardPage.js';
import { CartPage }      from '/Users/anshulchoukade/letshop-tests/pages/CartPage.js';

// ─── Shared test credentials ─────────────────────────────────
const USER = {
  email:    'anshika@gmail.com',
  password: 'Iamking@000',
};

// Product name that EXISTS on the dashboard (confirm this on the live app)
const PRODUCT = 'ZARA COAT 3';


// ─────────────────────────────────────────────────────────────
// beforeEach: log in before every single test in this file.
// This is the RIGHT pattern — each test is independent.
// If one test corrupts state, the others still pass.
// ─────────────────────────────────────────────────────────────
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(USER.email, USER.password);
  await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
});

// ════════════════════════════════════════════════════════════
// GROUP 1 — Happy path
// ════════════════════════════════════════════════════════════
test.describe('Cart — happy path', () => {

  test('TC01 | dashboard loads product cards after login', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    // At least one product card should be visible
    await dashboard.waitForProducts();
    const count = await dashboard.productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC02 | add one product to cart — badge updates', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    // Find and add the product
    const found = await dashboard.addToCart(PRODUCT);
    await expect(found, `Product "${PRODUCT}" not found on dashboard`).toBe(true);

    // The cart icon badge should now show 1
    // Give it a moment to update (it's a reactive UI)
    await page.waitForTimeout(1500);
    await expect(dashboard.cartCount).toBeVisible();
  });

  test('TC03 | added product appears in cart page', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const cart      = new CartPage(page);

    // Add product
    await dashboard.addToCart(PRODUCT);
    await page.waitForTimeout(1000);

    // Navigate to cart
    await dashboard.goToCart();

    // Product should be listed
    const hasProduct = await cart.containsProduct(PRODUCT);
    await expect(hasProduct, `"${PRODUCT}" not found in cart`).toBe(true);
  });

  test('TC04 | cart shows correct number of items after adding', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const cart      = new CartPage(page);

    await dashboard.addToCart(PRODUCT);
    await page.waitForTimeout(1000);
    await dashboard.goToCart();

    await cart.cartItems.first().waitFor({ state: 'visible', timeout: 10000 });

    const count = await cart.getItemCount();
    expect(count).toBe(1);
  });

  test('TC05 | cart page has a checkout button', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const cart      = new CartPage(page);

    await dashboard.addToCart(PRODUCT);
    await page.waitForTimeout(1000);
    await dashboard.goToCart();

    await expect(cart.checkoutButton).toBeVisible();
    await expect(cart.checkoutButton).toBeEnabled();
  });

});


// ════════════════════════════════════════════════════════════
// GROUP 2 — Multiple products
// ════════════════════════════════════════════════════════════
test.describe('Cart — multiple products', () => {

  test('TC06 | add two different products — cart count is 2', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const cart      = new CartPage(page);

    // Get the first two product names from the page
    const names = await dashboard.getProductNames();
    //expect(names.length).toBeGreaterThanOrEqual(2);

    await dashboard.addToCart(names[0].trim());
    await page.waitForTimeout(800);
    await dashboard.addToCart(names[1].trim());
    await page.waitForTimeout(800);

    await dashboard.goToCart();
    
    await cart.cartItems.first().waitFor({ state: 'visible', timeout: 10000 });

    const count = await cart.getItemCount();
    expect(count).toBe(2);
  });

});


// ════════════════════════════════════════════════════════════
// GROUP 3 — Negative / edge cases
// ════════════════════════════════════════════════════════════
test.describe('Cart — negative tests', () => {

  test('TC07 | attempting to add a non-existent product returns false', async ({ page }) => {
    const dashboard = new DashboardPage(page);

    // Our addToCart() method returns false if the product isn't on the page
    const found = await dashboard.addToCart('THIS PRODUCT DOES NOT EXIST XYZ');
    expect(found).toBe(false);
  });

  test('TC08 | cart page is accessible by direct navigation', async ({ page }) => {
    // Even without adding a product, navigating to /cart should not crash
    await page.goto('https://rahulshettyacademy.com/client/#/dashboard/cart');
    await expect(page).not.toHaveURL(/login/); // should not redirect to login
  });

});


// ════════════════════════════════════════════════════════════
// GROUP 4 — UI checks on cart page
// ════════════════════════════════════════════════════════════
test.describe('Cart — UI checks', () => {

  test('TC09 | each cart item displays a product name', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const cart      = new CartPage(page);

    await dashboard.addToCart(PRODUCT);
    await page.waitForTimeout(1000);
    await dashboard.goToCart();

    const names = await cart.getItemNames();
    // Every name should be a non-empty string
    for (const name of names) {
      expect(name.trim().length).toBeGreaterThan(0);
    }
  });

  test('TC10 | checkout button text is meaningful', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const cart      = new CartPage(page);

    await dashboard.addToCart(PRODUCT);
    await page.waitForTimeout(1000);
    await dashboard.goToCart();

    const btnText = await cart.checkoutButton.textContent();
    expect(btnText?.trim().length).toBeGreaterThan(0);
  });

});
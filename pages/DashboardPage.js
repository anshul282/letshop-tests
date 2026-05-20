// tests/pages/DashboardPage.js
// ─────────────────────────────────────────────────────────────
// Page Object for: /client/#/dashboard
// This page shows a grid of product cards after login.
// ─────────────────────────────────────────────────────────────

export class DashboardPage {
  constructor(page) {
    this.page = page;

    // ── Locators ──────────────────────────────────────────────
    this.productCards   = page.locator('#products');
    this.productTitles  = page.locator('.card b');           // bold product name in each card
    this.addToCartBtns  = page.locator('.card .card-body button');
    this.cartBadge      = page.locator('[routerlink="/dashboard/cart"] .label.label-success, .btn-group .fa-shopping-cart + .label');
    // Simpler fallback for the cart icon count if the above doesn't match:
    this.cartCount      = page.locator('button[routerlink="/dashboard/cart"]');
  }

  // Wait for the product grid to fully load
  async waitForProducts() {
    await this.productTitles.first().waitFor({ state: 'visible', timeout: 15000 });
  }

  // Returns all product name strings on the page
  async getProductNames() {
    await this.waitForProducts();
    return await this.productTitles.allTextContents();
  }

  // Clicks "Add To Cart" for the product matching the given name.
  // Returns true if the product was found, false if not.
  async addToCart(productName) {
    await this.waitForProducts();

    // Get all cards and find the one matching the name
    const allCards = this.page.locator('.card');
    const count = await allCards.count();

    for (let i = 0; i < count; i++) {
      const card = allCards.nth(i);
      const title = await card.locator('b').textContent();

      if (title.trim() === productName) {
        await card.locator('button').nth(1).click();
        return true;
      }
    }

    return false; // product not found
  }

  // Navigates to the cart page
  async goToCart() {
    await this.page.locator('[routerlink="/dashboard/cart"]').click();
    await this.page.waitForURL(/cart/);
  }
}
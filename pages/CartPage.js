// tests/pages/CartPage.js
// ─────────────────────────────────────────────────────────────
// Page Object for: /client/#/dashboard/cart
// ─────────────────────────────────────────────────────────────

export class CartPage {
  constructor(page) {
    this.page = page;

    // ── Locators ──────────────────────────────────────────────
    this.cartItems        = page.locator('.cart li');
    this.itemTitles       = page.locator('.cart li h3');
    this.itemPrices       = page.locator('.cart li p');
    this.checkoutButton   = page.locator('.subtotal button');
    this.emptyCartMessage = page.locator('.empty-cart, .cart p');
  }

  // Returns an array of product names currently in the cart
  async getItemNames() {
    await this.cartItems.first().waitFor({ state: 'visible', timeout: 10000 });
    return await this.itemTitles.allTextContents();
  }

  // Returns how many items are in the cart
  async getItemCount() {
    return await this.cartItems.count();
  }

  // Checks if a product name exists anywhere in the cart
  async containsProduct(productName) {
    const names = await this.getItemNames();
    return names.some(name => name.trim().includes(productName));
  }

  // Proceed to checkout
  async checkout() {
    await this.checkoutButton.click();
  }
}
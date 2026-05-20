// tests/pages/LoginPage.js
// ─────────────────────────────────────────────────────────────
// Page Object for: https://rahulshettyacademy.com/client/#/auth/login
//
// WHY A SEPARATE FILE?
// Every test that needs login imports this one class.
// If the locator changes tomorrow, you fix it HERE — not in 10 test files.
// ─────────────────────────────────────────────────────────────

export class LoginPage {
  constructor(page) {
    this.page = page;

    // ── Locators ──────────────────────────────────────────────
    // Using the actual selectors from the live app
    this.emailInput    = page.locator('#userEmail');
    this.passwordInput = page.locator('#userPassword');
    this.loginButton   = page.locator('[value="Login"]');
    this.toastError    = page.locator('#toast-container');
    this.errorMassage   = page.getByRole('alert').filter({ hasText: 'Incorrect email or password' })
  }

  // Navigate directly to the login page
  async goto() {
    await this.page.goto('https://rahulshettyacademy.com/client/#/auth/login');
  }

  // Fill in both fields and submit
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
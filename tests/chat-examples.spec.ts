import { test, expect, type Page, type Locator } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com/';

function priceToNumber(price: string): number {
  return Number(price.replace('$', '').trim());
}

async function login(page: Page, username = 'standard_user') {
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/inventory/);
}

test.describe('Playwright live-coding cheat sheet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Swag Labs/);
  });

  test('should complete a basic product flow', async ({ page }) => {
    await test.step('Login', async () => {
      await login(page);
      await expect(page.getByText('Products')).toBeVisible();
    });

    await test.step('Find exact product card', async () => {
      const product: Locator = page.locator('.inventory_item').filter({ has: page.getByText('Sauce Labs Backpack', { exact: true }) });

      await expect(product).toHaveCount(1);
      await expect(product.getByText('Sauce Labs Backpack')).toBeVisible();

      const price = product.locator('.inventory_item_price');
      await expect(price).toBeVisible();

      const priceText = await price.textContent();
      expect(priceText).not.toBeNull();
      expect(priceToNumber(priceText!)).toBeGreaterThan(0);

      await product.getByRole('button', { name: 'Add to cart' }).click();
      await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    });

    await test.step('Validate cart', async () => {
      await page.getByRole('link', { name: 'Shopping Cart' }).click();
      await expect(page).toHaveURL(/cart/);
      await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Checkout' })).toBeEnabled();
    });
  });

  test('should show an error for invalid login', async ({ page }) => {
    await login(page, 'locked_out_user');
    await expect(page.getByText(/locked out/i)).toBeVisible();
  });
});

/*
Najčešće zamke:
- Ne koristi waitForTimeout(); čekaj element, URL, response ili web-first assertion.
- Izbegavaj nth(), first(), dugačak XPath i CSS kada postoji stabilniji locator.
- Locator ne mora da bude await; akcije i asercije moraju.
- Scope-uj element preko forme, kartice ili reda tabele da izbegneš duplikate.
- Ne proveravaj samo klik; proveri rezultat kroz toHaveURL/toHaveText/toBeVisible.
- Pokreći prvo jedan test: npx playwright test putanja.spec.ts --headed
*/
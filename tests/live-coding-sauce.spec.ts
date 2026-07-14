import {test, expect} from "@playwright/test"

test.describe("Pages functionality", () => {
  test("Jedan veliki test", async ({ page }) => {


    //opens the page and asserts that we are on the correct page
    await page.goto("https://www.saucedemo.com/");
    await expect(page.getByText('Swag Labs')).toBeVisible();
    await expect(page.locator('#login_button_container')).toBeVisible();

    //login with valid credentials - standard user
    await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('username').fill('standard_user');
    await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('password').fill('secret_sauce');
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "Login" }).click();

    const product = page.locator('[data-test="inventory-item"]').filter({  has: page.getByText('Sauce Labs Backpack'),});
    const price = product.locator('[data-test="inventory-item-price"]');
    const priceComp = await price.textContent();
    const itemTotal = page.locator('[data-test="subtotal-label"]')

    //assert if the user is logged in by seeing the logout option
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await expect(page.locator('[data-test="logout-sidebar-link"]')).toBeVisible();
    await page.waitForTimeout(1000);
    //find exact product
    await product.click();

    //verifying name, about and that the price is above 0
    await expect(product.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(product.getByText('carry.allTheThings() with the')).toBeVisible();
    expect(Number(priceComp?.replace('$', ''))).toBeGreaterThan(0);

    await page.waitForTimeout(1000);
    //add to cart click
    await product.getByRole('button', { name: 'Add to cart' }).click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    await page.waitForTimeout(1000);
    //assertion that the inverntory form is present
    await expect(page.locator('[data-test="inventory-item"]')).toBeVisible();

    await page.waitForTimeout(1000);
    //assertion that the right product and right data is present
    await expect(product.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(product.getByText('carry.allTheThings() with the')).toBeVisible();
    await expect(product.getByText('carry.allTheThings() with the')).toBeVisible();
    await expect(price).toBeVisible();

    //start the checkout
    await page.getByTestId('checkout').click();

    //fill the right data
    await page.waitForTimeout(1000);
    await page.locator('form').getByPlaceholder('firstName').fill('Milos');
    await page.locator('form').getByPlaceholder('lastName').fill('Sreckovic');
    await page.locator('form').getByPlaceholder('postalCode').fill('11000');

    //press continue
    await page.waitForTimeout(1000);
    await page.locator('[data-test="continue"]').click();
    
    //assert that the right price is present and that it matches item total
    await page.waitForTimeout(1000);
    await expect(price).toBeVisible();
    await expect(itemTotal).toBeVisible();
    expect(price===itemTotal,"the Prices are the same");

  });
});
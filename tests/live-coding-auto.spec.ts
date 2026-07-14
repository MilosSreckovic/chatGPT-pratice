import {test, expect} from "@playwright/test"

test.describe("Pages functionality", () => {
  test.beforeEach("Verify that the user is logged in", async ({ page }) => {

    await page.route("**/*", async (route) => {
      const url = route.request().url();

      //code to block the marketing commerials popups on screen
      if (
        url.includes("googleads") ||
        url.includes("doubleclick") ||
        url.includes("googlesyndication") ||
        url.includes("adservice")
      ) {
        await route.abort();
      } else {
        await route.continue();
      }
    });

    const signupLoginLink = page.getByRole("link", { name: "Signup / Login" });

    //opens the page and asserts that we are on the correct page
    await page.goto("https://automationexercise.com");
    await expect(page.getByRole("heading", { name: "AutomationExercise" }),).toBeVisible();

    //button confirmation
    await expect(signupLoginLink).toBeVisible();
    await signupLoginLink.click();

    //login page
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator(".login-form")).toBeVisible();

    //login with valid credentials
    await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill("automationpw@example.com");
    await page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Password').fill("Playwright123!");
    await page.getByRole("button", { name: "Login" }).click();

    //assert if the right user is logged in
    await expect(page.getByText("Logged in as Milos Sreckovic")).toBeVisible();
  });

  test("Should add one product in cart", async ({ page }) => {

    //go to the special products page
    const products = page.getByRole("link", { name: "Products" });
    await expect(products).toBeVisible();
    await products.click();

    //find exact product to put into cart
    const product = page.getByText("Men Tshirt");
    await page.locator(".productinfo").filter({ has: product }).getByText("Add to cart", { exact: true }).first().click();

    //verification that the product is added into cart
    await expect(page.getByText("Your product has been added to cart."),).toBeVisible();
    await page.getByRole("link", { name: "View Cart" }).click();
    await expect(page.getByRole("row").filter({ has: product })).toBeVisible();

  });
});
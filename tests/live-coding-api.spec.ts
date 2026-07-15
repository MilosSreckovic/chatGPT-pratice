import { test, expect } from '@playwright/test';

test('GET all products returns product list', async ({ request }) => {
  const response = await request.get(
    'https://automationexercise.com/api/productsList'
  );

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.responseCode).toBe(200);
  expect(body.products).toBeDefined();
  expect(body.products.length).toBeGreaterThan(0);

  expect(body.products[0]).toHaveProperty('id');
  expect(body.products[0]).toHaveProperty('name');
  expect(body.products[0]).toHaveProperty('price');
  expect(body.products[0]).toHaveProperty('brand');
});

import { test, expect } from '@playwright/test';

const baseUrl = 'https://automationexercise.com/api';
let email: string;
let password: string;

// These tests are intentionally executed in serial mode because test below
// create account, login and delete account share the same dynamically created user
test.describe.configure({ mode: 'serial' });

test('POST verify negative login without email and password', async ({ request }) => {
  const response = await request.post(`${baseUrl}/verifyLogin`);

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.responseCode).toBe(400);
  expect(body.message).toBe('Bad request, email or password parameter is missing in POST request.');
});


test('POST create account', async ({ request }) => {
  email = `milos.autoqa.${Date.now()}@test.com`;
  password = 'Test123456';

  const response = await request.post(`${baseUrl}/createAccount`, {
    form: {
      name: 'Milos AutoQA', email: email, password: password, title: 'Mr',
      birth_date: '10', birth_month: '10', birth_year: '1990',
      firstname: 'Milos', lastname: 'Sreckovic', company: 'QA Test Company',
      address1: 'Test Address 1', address2: 'Test Address 2', country: 'Serbia',
      zipcode: '11000', state: 'Belgrade', city: 'Belgrade', mobile_number: '0601234567',
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.responseCode).toBe(201);
  expect(body.message).toBe('User created!');
});


test('POST verify login with valid credentials', async ({ request }) => {
  const response = await request.post(`${baseUrl}/verifyLogin`, {
    form: {
      email: email,
      password: password,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.responseCode).toBe(200);
  expect(body.message).toBe('User exists!');
});


test('DELETE account', async ({ request }) => {
  const response = await request.delete(`${baseUrl}/deleteAccount`, {
    form: {
      email: email,
      password: password,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.responseCode).toBe(200);
  expect(body.message).toBe('Account deleted!');
});

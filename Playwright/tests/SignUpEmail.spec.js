import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
const config = require('./config');

test.use({ storageState: 'auth.json' });



test('Sign Up Wrong Email', async ({ page }) => {
    await page.goto('/');
    await page.getByText('sign up').click();

    await page.getByPlaceholder('enter your e-mail address').click();
    await page.getByPlaceholder('enter your e-mail address').fill('far2shok');
    await page.getByPlaceholder('8 char. +1 symbol, number,').click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill('Qwert1234!');
    await page.getByPlaceholder('confirm your password').click();
    await page.getByPlaceholder('confirm your password').fill('Qwert1234!');
    await page.getByRole('button', { name: 'Next' }).click();

    // Invalid email format error
    await expect(page.locator('#auth-form')).toContainText('Enter a valid email address.');
});

    test('Sign Up Wrong Password', async ({ page }) => {

    await page.goto('/');

    await page.getByText('sign up').click();

    await page.getByPlaceholder('enter your e-mail address').click();
    await page.getByPlaceholder('enter your e-mail address').fill('far2shok@yahoo.com');
    await page.getByPlaceholder('8 char. +1 symbol, number,').click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill('Qwert1234!');
    await page.getByPlaceholder('confirm your password').click();
    await page.getByPlaceholder('confirm your password').fill('Qwert12345!');
    await page.getByRole('button', { name: 'Next' }).click();

    // Passwords do not match error
    await expect(page.locator('#auth-form')).toContainText('The two password fields didn’t match.');
});

test.skip('Sign Up >> No Verification code', async ({ page }) => {

    const randomName = faker.person.firstName();
    const randomSurname = faker.person.lastName();

  await page.goto('/');
  await page.getByText('sign up').click();
  await page.getByPlaceholder('enter your e-mail address').click();
  await page.getByPlaceholder('enter your e-mail address').fill('far2shok@yahoo.com');

    await page.getByPlaceholder('8 char. +1 symbol, number,').click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill('Qwert1234!');
    await page.getByPlaceholder('confirm your password').click();
    await page.getByPlaceholder('confirm your password').fill('Qwert1234!');
    await page.getByRole('button', { name: 'Next' }).click();

    // Check Popup to be visible
    await expect(page.getByText('Enter your name')).toBeVisible();

    // Fill the User Full Name
    await page.getByPlaceholder('enter your first name').click();
    await page.getByPlaceholder('enter your first name').fill(randomName);
    await page.getByPlaceholder('enter your last name').click();
    await page.getByPlaceholder('enter your last name').fill(randomSurname);
    await page.getByRole('button', { name: 'Next' }).click();

    // Check Popup to be visible
    await expect(page.getByText('Get verified')).toBeVisible();

    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.locator('#auth-form')).toContainText('Incorrect token used. Please try again.');
    await expect(page.locator('#auth-form')).toContainText('This field is required.');

});

import { test, expect } from '@playwright/test';
const config = require('./config');

//BEGOERE RUNING THE TESTS
// RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
// RUN npx playwright test tests/loginUcol.spec.js

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail;
const password = config.password;

// Login OK
test('Login OK', async ({ page }) => {

    await page.goto('/');

    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();

    await page.getByPlaceholder('enter your e-mail address').fill(mail);


    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').click();

    await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();

    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');
    await expect(page.locator('#language-toggler path')).toBeVisible();
    //await page.getByRole('img', { name: 'Avatar profile' }).click(); //not working if no image selected 

    await page.locator('#profile-toggler').click();
    await page.getByRole('link', { name: 'Sign Out' }).click();
});

test('Login with empty email ', async ({ page }) => {

    await page.goto('/');
    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByRole('button', { name: 'Log in' }).click();

    //error message "This field is required."
    await expect(page.locator('#auth-form')).toContainText('This field is required.');
    await expect(page.locator('#auth-modal-content')).toContainText('No account? Sign up');

});

test('Login with not exicting user', async ({ page }) => {
    await page.goto('/');
    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();
    await page.getByPlaceholder('enter your e-mail address').fill(mail);
    await page.getByRole('button', { name: 'Log in' }).click();

    //Not existing user flow 
    await expect(page.locator('#auth-modal-content')).toContainText('Sign up');
    await expect(page.locator('#auth-modal-content')).toContainText('No account? Sign up');
});

test('Login with not Correct email format', async ({ page }) => {
    await page.goto('/');
    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').fill('testgmail.com')
    await page.getByRole('button', { name: 'Log in' }).click();

    //error message 
    await expect(page.locator('#auth-form')).toContainText('Enter a valid email address.');
    await expect(page.locator('#auth-modal-content')).toContainText('No account? Sign up');

});

test('Logout success', async ({ page }) => {
    await page.goto('/');
    //  await page.pause();
    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();

    await page.getByPlaceholder('enter your e-mail address').fill(mail);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();

    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');
    await expect(page.locator('#language-toggler path')).toBeVisible();
    await page.getByRole('img', { name: 'Avatar profile' }).click();
    await page.getByRole('link', { name: 'Sign Out' }).click();
    await expect(page.locator('#profile')).toContainText('log in / sign up');
});
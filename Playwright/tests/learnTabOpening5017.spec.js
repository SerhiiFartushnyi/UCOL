import { test, expect } from '@playwright/test';
const config = require('./config');

//BEGOERE RUNING THE TESTS
// RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
// RUN npx playwright test tests/loginUcol.spec.js

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail;
const password = config.password;

// Learn Page Logged in User
test('Learn Page Logged in User', async ({ page }) => {

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

    await page.getByRole('link', { name: 'learn' }).click();
    await expect(page.locator('body')).toContainText('coolab.ai // blog');

    const url = page.url();
    await expect(url).toBe('https://blog.coolab.ai/'); 

});

test('Learn Page NOT Logged in User', async ({ page }) => {

    await page.goto('/');

    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');

    await page.getByRole('link', { name: 'learn' }).click();
    await expect(page.locator('body')).toContainText('coolab.ai // blog');

    const url = page.url();
    await expect(url).toBe('https://blog.coolab.ai/'); 

});
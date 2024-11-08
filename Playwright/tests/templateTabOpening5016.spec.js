import { test, expect } from '@playwright/test';
const config = require('./config');

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail;
const password = config.password;

//  Templaye page opening
test('Template tab Opening', async ({ page }) => {

    await page.goto('/');

    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();

    await page.getByPlaceholder('enter your e-mail address').fill(mail);


    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').click();
    //   await page.getByPlaceholder('8 char. +1 symbol, number,').fill('QWERTy123!');
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password);

    await page.getByRole('button', { name: 'Log in' }).click();

    //Assertions to check if the user is logged in

    await expect(page.locator('body')).toContainText('Design professional');
    await expect(page.locator('#language-toggler path')).toBeVisible();

    const template = page.getByRole('link', { name: 'templates', exact: true });
    await expect(template).toBeVisible();
    await template.click();

    // Check page  
    await expect(page.getByText('WELCOME TO SCENE')).toBeVisible();
    expect(page.url()).toContain('/templates/');

});

test('Template tab Opening NOT LOgged in User', async ({ page }) => {

    await page.goto('/');

    
    const template = page.getByRole('link', { name: 'templates', exact: true });
    await expect(template).toBeVisible();
    await template.click();

    // Check page  
    await expect(page.getByText('WELCOME TO SCENE')).toBeVisible();
    expect(page.url()).toContain('/templates/');

});


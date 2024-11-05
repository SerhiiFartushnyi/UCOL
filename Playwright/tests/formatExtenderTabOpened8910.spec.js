import { test, expect } from '@playwright/test';
import config from './config';

//BEGOERE RUNING THE TESTS
// RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
// RUN npx playwright test tests/loginUcol.spec.js

// Use the saved authentication state

test.use({ storageState: 'auth.json' });

const mail = config.mail;
const password = config.password;


//Format Extender Tab Opening 

test ('Format Extender Tab Opening', async ({ page }) => {
    test.slow();
    await page.goto('/');

    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();
    await page.getByPlaceholder('enter your e-mail address').fill(mail);
    await page.getByRole('button', { name: 'Log in' }).click();

    await page.getByPlaceholder('8 char. +1 symbol, number,').click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();

    //Assertions to check if the user is logged in
    await page.waitForSelector('body');
    await expect(page.locator('body')).toContainText('Design professional');

    await page.waitForLoadState('networkidle');

    // Go To Scene Tab >> Format Extender
    await page.getByText('features', { exact: true }).click();
    await page.getByRole('link', { name: 'format extender' }).click();

    await page.getByRole('link', { name: 'start now' }).first().click();
    
    //await page.goto('/tool/studio/');

    await expect(page.getByRole('heading', { name: 'format extender' })).toBeVisible();
    await expect(page.getByText('Select one of your projects')).toBeVisible();

    // Click another tab and than check if Format extender button is working 
    await page.locator('#re-gen').click();
    await page.locator('#format-extender').click();
    await expect(page.getByRole('heading', { name: 'format extender' })).toBeVisible();
});
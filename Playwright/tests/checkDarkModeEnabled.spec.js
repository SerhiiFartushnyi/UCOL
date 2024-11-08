import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
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

// Enable Dark Mode and Check
test('Enable Dark mode and Check', async ({ page }) => {

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

    await page.waitForLoadState('networkidle')

    const profileIcon = page.locator('#profile-toggler');
    await page.waitForSelector('#profile-toggler');
    await expect(profileIcon).toBeVisible();
    await profileIcon.click();
    
    // await page.(locator('#profile-container span')).filter({ hasText: 'Dark Mode' })
    await page.locator('#profile-container label span').click();

    // Check if the Dark Mode is enabled
    const isDarkModeEnabled = await page.evaluate(() => {
        const htmlElement = document.getElementById('dark-class-place');
        return htmlElement && htmlElement.classList.contains('dark');
    });

    // Log the result
    console.log('Dark mode enabled:', isDarkModeEnabled);

    // Assert that dark mode is enabled
    expect(isDarkModeEnabled).toBe(true);

    await expect(page.getByRole('link', { name: 'start designing now' })).toBeVisible();

    // Check if the link has the exact background color #fffb00
    
    // const element = await page.getByRole('link', { name: 'start designing now' });
    // await expect(element).toHaveCSS('background', 'rgb(255, 251, 0)');
    // await expect(element).toHaveCSS('color', 'rgb(0, 0, 0)');

});
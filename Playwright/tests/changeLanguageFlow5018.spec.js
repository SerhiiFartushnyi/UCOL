import { test, expect } from '@playwright/test';
const config = require('./config');
/*
BEGOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail;
const password = config.password;

// test.beforeEach(async ({ page }) => {
//     await page.goto('/');
//     // Enter the login credentials
//     await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
//     await page.getByPlaceholder('enter your e-mail address').click();
//     await page.getByPlaceholder('enter your e-mail address').fill(mail);

//     await page.getByRole('button', { name: 'Log in' }).click();
//     await page.getByPlaceholder('8 char. +1 symbol, number,').click();
//     await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password);

//     await page.getByRole('button', { name: 'Log in' }).click();
//});

// Change Language

test ('Change Language', async ({ page }) => {
    test.slow();
    await page.goto('/');
    // Enter the login credentials
    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();
    await page.getByPlaceholder('enter your e-mail address').fill(mail);

    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password);

    await page.getByRole('button', { name: 'Log in' }).click();
    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');

    // Attempt to click on the #language-toggler element directly

    await page.waitForLoadState('networkidle'); //!!!WAIT FOR ALL RENDERED !!! WAIT FOR ALL NETWORK REQUESTS TO FINISHED 
    await expect(page.locator('#language-toggler')).toBeVisible();
    await page.locator('#language-toggler').click();

    await page.waitForLoadState('networkidle')
    await page.locator('#language-dropdown').getByText('Español').click();

    //Accertion of the language change to Espaniol
    expect(page.url()).toContain('/?language=es');
    await expect(page.getByRole('navigation')).toContainText('aprender');

    await page.waitForLoadState('networkidle');
    const profileIcon = page.locator('#profile-toggler');
    await page.waitForSelector('#profile-toggler');
    await expect(profileIcon).toBeVisible();
    await profileIcon.click();
    await expect(page.locator('#profile-container')).toContainText('Desconectar');
    
    // Click on the element with the text 'Desconectar'
    await page.getByRole('link', { name: 'Desconectar' }).click();

});

// Check Language Applied after relogin 
// DOES NOT WORK As Test runs at isolated environment

test.skip('Check Language Applied after relogin', async ({ page }) => {
    //await page.pause();

    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');

    // Attempt to click on the #language-toggler element directly

    // await page.waitForLoadState('networkidle'); //!!!WAIT FOR ALL RENDERED !!! WAIT FOR ALL NETWORK REQUESTS TO FINISHED 
    // await expect(page.locator('#language-toggler')).toBeVisible();
    // await page.locator('#language-toggler').click();

    // await page.waitForLoadState('networkidle')
    // await expect (page.locator('#language-dropdown').getByText('Español')).click();

    //Accertion of the language change to Espaniol
    //await expect(page.locator('#dropdown-toggler')).toContainText('diseño');
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('navigation')).toContainText('aprender');
    const profileIcon = page.locator('#profile-toggler');
    await page.waitForSelector('#profile-toggler');
    await profileIcon.click();
    await expect(page.locator('#profile-container')).toContainText('Desconectar');

});

test('Change Language Not logged in User', async ({ page }) => {
    await page.goto('/');

    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');

    // Attempt to click on the #language-toggler element directly
    await page.waitForLoadState('networkidle'); //!!!WAIT FOR ALL RENDERED !!! WAIT FOR ALL NETWORK REQUESTS TO FINISHED 
    await expect(page.locator('#language-toggler')).toBeVisible();
    await page.locator('#language-toggler').click();

    await page.waitForLoadState('networkidle')
    await page.locator('#language-dropdown').getByText('Português Brasileiro').click();

    //Accertion of the language change to Espaniol
    await expect(page.getByRole('navigation')).toContainText('aprender');
    await expect(page.locator('#profile')).toContainText('Conecte-se');
    expect(page.url()).toContain('/?language=pt-br');
});

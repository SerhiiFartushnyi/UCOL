import { test, expect } from '@playwright/test';
const config = require('./config');

//BEGOERE RUNING THE TESTS
// RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
// RUN npx playwright test tests/loginUcol.spec.js

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail;
const password = config.password;

test('Use this template NOT Logged in User', async ({ page }) => {

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

    
    const template = page.getByRole('link', { name: 'templates', exact: true });
    await expect(template).toBeVisible();
    await template.click();

    // Check page  
    await expect(page.getByText('WELCOME TO SCENE')).toBeVisible();
    expect(page.url()).toContain('/templates/');

    // Choose a random style
    const styles = page.locator('#genres-list > li.rounded-lg');
    // Get the text of all the styles
    const stylesTextArray = await styles.evaluateAll(elements => 
    elements.map(element => element.querySelector('a').textContent.trim())
);
    // Click on a random style
    const randomIndex = Math.floor(Math.random() * stylesTextArray.length);
    const randomStyle = stylesTextArray[randomIndex];
    await page.getByRole('link', { name: randomStyle }).click();
    
    // Click on first template

    await page.waitForLoadState('networkidle');
    await page.locator('.infinite-item > .relative > .w-full').first().click();
    await page.getByRole('link', { name: 'use this template' }).click();

    await page.waitForLoadState('networkidle');
    
    // Check Create Scene page
    await expect(page.getByRole('button', { name: 'Randomize Template' })).toBeVisible();
    await expect(page.getByLabel('Editor canvas')).toBeVisible();
    // Check URL
    expect(page.url()).toContain('/scene/');

});
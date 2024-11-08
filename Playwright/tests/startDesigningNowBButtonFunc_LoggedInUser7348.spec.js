import { test, expect } from '@playwright/test';
const config = require('./config');

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail2 = config.mail2;
const password = config.password;
const mail1 = config.mail1;
const password1 = config.password1;

test (' header >> Start Designing User Without projects', async ({ page }) => {

    await page.goto('/');

    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();

    await page.getByPlaceholder('enter your e-mail address').fill(mail2);

    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').click();

    await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();

    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');
    await expect(page.locator('#language-toggler path')).toBeVisible();

    await expect(page.getByRole('link', { name: 'start designing now' })).toBeVisible();
    await page.getByRole('link', { name: 'start designing now' }).click();

    await expect(page.locator('#projects-tab-content')).toContainText('start a new project');
    const goToScene = page.getByRole('link', { name: 'go to scene' })
    await expect(goToScene).toBeVisible();
    await goToScene.click();

    expect(page.url()).toContain('/scene/');
});

test(' header >> Start Designing User WITH projects', async ({ page }) => {

    await page.goto('/');

    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();

    await page.getByPlaceholder('enter your e-mail address').fill(mail1);


    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').click();

    await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password1);
    await page.getByRole('button', { name: 'Log in' }).click();

    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');
    await expect(page.locator('#language-toggler path')).toBeVisible();

    await expect(page.locator('#create-template')).toBeVisible();
    await page.locator('#create-template').click();
    
    //Assertion to check if the user is on the Scene

    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/scene/');
    await expect(page.getByRole('button', { name: 'Projects' })).toBeVisible();
});
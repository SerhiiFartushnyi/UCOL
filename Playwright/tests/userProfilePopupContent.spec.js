import { test, expect } from '@playwright/test';
const config = require('./config');

/* 
//BEGOERE RUNING THE TESTS
 RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
 RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = config.mail1;
let password = config.password1;

test.beforeEach(async ({ page }) => {
    
    await page.goto('/');
    // Enter the login credentials and Log in
    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();

    // Used the saved email from the config file
    await page.getByPlaceholder('enter your e-mail address').fill(email);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();

});

test('Profile popup', async ({ page }) => {

    // Check if the user is logged in
    await expect(page.locator('#profile-toggler')).toBeVisible();
    await page.waitForLoadState('networkidle');
    await page.locator('#profile-toggler').click();
    
    await page.waitForLoadState('networkidle');
   
    // Check Profile information
    await expect(page.locator('#profile-container')).toContainText('Daria Bochulya');
    await expect(page.locator('#profile-container')).toContainText(email);

    // Check text in Popup Window 
    await expect(page.getByRole('link', { name: 'Go to Projects' })).toBeVisible();

});

test('Profile Information', async ({ page }) => {
    //await page.waitForSelector('img', { name: 'Avatar profile' });
    await expect(page.locator('#profile-toggler')).toBeVisible();
    await page.waitForLoadState('networkidle');
    //await page.getByRole('img', { name: 'Avatar profile' }).click();
    await page.locator('#profile-toggler').click();

    // Check text in Popup Window 
    await expect(page.getByRole('link', { name: 'Go to Projects' })).toBeVisible();
    await page.getByRole('link', { name: 'Go to Account Settings' }).click();

    // Check text in Account Settings
    await expect(page.locator('#account-section')).toContainText('Manage your account information');

    // Check User's Full Name 
    await expect(page.locator('#full_name')).toContainText('Daria Bochulya');
    await expect(page.getByRole('link', { name: 'dariya.bochulya@coaxsoft.com' })).toHaveText(email);

    // Recall Profile Popup 
    await page.locator('#update-profile-info-modal-trigger-btn').click();      

    //Check Account Upadte Info Popup Fields
    await expect(page.locator('#update-profile-info-modal')).toContainText('update profile');

    await expect(page.locator('input[name="first_name"]')).toHaveValue('Daria');
    await expect(page.locator('input[name="last_name"]')).toHaveValue('Bochulya');

    //await expect(page.locator('input[name="username"]')).toHaveValue(mail);

    await page.locator('#update-profile-info-modal').getByText('cancel').click();

});

test('Profile >> Go to Progects Page', async ({ page }) => {

    // Check if the user is logged in
    await page.waitForSelector('img', { name: 'Avatar profile' });
    await expect(page.getByRole('img', { name: 'Avatar profile' })).toBeVisible();
   
    await page.waitForLoadState('networkidle');
    await page.getByRole('img', { name: 'Avatar profile' }).click();

    // Check Profile information
    await expect(page.locator('#profile-container')).toContainText('Daria Bochulya');
    await expect(page.locator('#profile-container')).toContainText(email);

    // Check text in Popup Window

    await expect(page.getByRole('link', { name: 'Go to Projects' })).toBeVisible();
    await page.getByRole('link', { name: 'Go to Projects' }).click();

    // Check if the user is on the Projects Page
    await expect(page.url()).toContain('https://ucl-coolab-dev.uk.r.appspot.com/projects/');
    await expect(page.locator('#projects-tabs')).toContainText('DEVELOPER');
    await expect(page.getByRole('heading')).toContainText('Projects');
    await expect(page.locator('#add-new-project-btn')).toContainText('new design');

    await page.close();

});
 
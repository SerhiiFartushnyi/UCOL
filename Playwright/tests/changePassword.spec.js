import { test, expect } from '@playwright/test';
const config = require('./config');

/* 
 // Define the flag to skip beforeEach for specific tests
 let skipBeforeEach = false;

//BEGOERE RUNING THE TESTS
 RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
 RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail;
let password = config.password;

// Change password Flow 

test.beforeEach(async ({ page }) => {
    // if (skipBeforeEach) return;

    await page.goto('/');
    // Enter the login credentials and Log in
    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();

    // Used the saved email from the config file
    await page.getByPlaceholder('enter your e-mail address').fill(mail);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();

});

test('Invalid current password.', async ({ page }) => {

    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');

    // Go to Change Password Page

    await page.getByRole('img', { name: 'Avatar profile' }).click();
    await page.getByRole('link', { name: 'Go to Account Settings' }).click();
    await page.waitForLoadState('networkidle')
    await page.getByRole('link', { name: 'password' }).click();
    await expect(page.locator('#password-section')).toContainText('password');
    await page.waitForLoadState('networkidle')
    await page.getByRole('link', { name: 'Change Password' }).click();
    await expect(page.locator('#change-password-modal')).toContainText('Change password');

    // Change password Not Correct old password
    // await page.pause();
    await page.getByPlaceholder('current password').click();
    await page.getByPlaceholder('current password').fill(password + 1);
    await page.getByRole('textbox', { name: 'new password' }).click();
    await page.getByRole('textbox', { name: 'new password' }).fill(password + 2);
    await page.getByPlaceholder('verify password').click();
    await page.getByPlaceholder('verify password').fill(password + 2);
    await page.getByPlaceholder('verify password').press('Enter');

    await page.getByRole('button', { name: 'save' }).click();
    await expect(page.locator('#change-password-modal-error-message')).toContainText('error: Invalid current password.');
    await page.close();
});

test('Passwords do not match', async ({ page }) => {

    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');

    // Go to Change Password Page

    await page.getByRole('img', { name: 'Avatar profile' }).click();
    await page.getByRole('link', { name: 'Go to Account Settings' }).click();
    await page.waitForLoadState('networkidle')
    await page.getByRole('link', { name: 'password' }).click();
    await expect(page.locator('#password-section')).toContainText('password');
    await page.waitForLoadState('networkidle')
    await page.getByRole('link', { name: 'Change Password' }).click();
    await expect(page.locator('#change-password-modal')).toContainText('Change password');

    // Change password Passwords does not mutch
    //await page.pause();
    await page.getByPlaceholder('current password').click();
    await page.getByPlaceholder('current password').fill(password);
    await page.getByRole('textbox', { name: 'new password' }).click();
    await page.getByRole('textbox', { name: 'new password' }).fill(password + 3);
    await page.getByPlaceholder('verify password').click();
    await page.getByPlaceholder('verify password').fill(password + 4);
    await page.getByPlaceholder('verify password').press('Enter');

    await page.getByRole('button', { name: 'save' }).click();

    await expect(page.locator('#change-password-modal-error-message')).toContainText('Passwords don\'t match.');
    await page.close();
});

test('Passwords Success', async ({ page }) => {

    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');

    // Go to Change Password Page
    await page.getByRole('img', { name: 'Avatar profile' }).click();
    await page.getByRole('link', { name: 'Go to Account Settings' }).click();
    await page.waitForLoadState('networkidle')
    await page.getByRole('link', { name: 'password' }).click();
    await expect(page.locator('#password-section')).toContainText('password');
    await page.waitForLoadState('networkidle')
    await page.getByRole('link', { name: 'Change Password' }).click();
    await expect(page.locator('#change-password-modal')).toContainText('Change password');

    // Change password to new password
    //await page.pause();
    await page.getByPlaceholder('current password').click();
    await page.getByPlaceholder('current password').fill(password);
    await page.getByRole('textbox', { name: 'new password' }).click();
    await page.getByRole('textbox', { name: 'new password' }).fill('Qwert12345!');
    await page.getByPlaceholder('verify password').click();
    await page.getByPlaceholder('verify password').fill('Qwert12345!');
    await page.getByPlaceholder('verify password').press('Enter');

    await page.getByRole('button', { name: 'save' }).click();

    // Check Success Message
    const loggedInMessage = await page.getByText('Password updated successfully');
    await expect(loggedInMessage).toHaveText('Password updated successfully');
    await page.close();
});

// !!! Need to play with skipBefore Each Functionallity 

// skipBeforeEach = true;
// test('Fail to login with old password', async ({ page }) => {
//     //skipBeforeEach = true;

//     await page.goto('/');
//     // Enter the login credentials and Log in
//     await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
//     await page.getByPlaceholder('enter your e-mail address').click();
//     await page.getByPlaceholder('enter your e-mail address').fill(mail);
//     await page.getByRole('button', { name: 'Log in' }).click();
//     await page.getByPlaceholder('8 char. +1 symbol, number,').click();
//     await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password+1);
//     await page.getByRole('button', { name: 'Log in' }).click();

//     await expect(page.locator('#auth-form')).toContainText('Please enter a correct email and password. Note that both fields may be case-sensitive.');
//     skipBeforeEach = false;
// });

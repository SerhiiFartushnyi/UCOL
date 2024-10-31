import { test, expect } from '@playwright/test';
const config = require('./config');

/* 
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

    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');

    // Go to Change Password Page
    await page.locator('#profile-toggler').click();
    await page.getByRole('link', { name: 'Go to Account Settings' }).click();
    await page.waitForLoadState('networkidle')
    await page.getByRole('link', { name: 'password' }).click();
    await expect(page.locator('#password-section')).toContainText('password');
    await page.waitForLoadState('networkidle')
    await page.getByRole('link', { name: 'Change Password' }).click();
    await expect(page.locator('#change-password-modal')).toContainText('Change password');
});

test('Invalid current password.', async ({ page }) => {

    // Change password Not Correct old password
    const currentPassword = await page.getByPlaceholder('current password');
    await currentPassword.click();
    await currentPassword.fill(password + 1);

    const newPassword = page.getByRole('textbox', { name: 'new password' });
    await newPassword.click();
    await newPassword.fill(password + 2);

    const verifyPassword = page.getByPlaceholder('verify password');
    await verifyPassword.click();
    await verifyPassword.fill(password + 2);
    await verifyPassword.press('Enter');

    await page.getByRole('button', { name: 'save' }).click();
    await expect(page.locator('#change-password-modal-error-message')).toContainText('error: Invalid current password.');
});

test('Passwords do not match', async ({ page }) => {

    // Change password Passwords does not mutch
    const currentPassword = await page.getByPlaceholder('current password');
    await currentPassword.click();
    await currentPassword.fill(password);

    const newPassword = page.getByRole('textbox', { name: 'new password' });
    await newPassword.click();
    await newPassword.fill(password + 3);
    
    const verifyPassword = page.getByPlaceholder('verify password');
    await verifyPassword.click();
    await verifyPassword.fill(password + 4);
    await verifyPassword.press('Enter');

    await page.getByRole('button', { name: 'save' }).click();

    // Check Error Message 
    await expect(page.locator('#change-password-modal-error-message')).toContainText('Passwords don\'t match.');
});

test('Passwords Success', async ({ page }) => {

    // Change password to new password
    const currentPassword = await page.getByPlaceholder('current password');
    await currentPassword.click();
    await currentPassword.fill(password);

    const newPassword = page.getByRole('textbox', { name: 'new password' });
    await newPassword.click();
    await newPassword.fill('Qwert12345!');
    
    const verifyPassword = page.getByPlaceholder('verify password');
    await verifyPassword.click();
    await verifyPassword.fill('Qwert12345!');
    await verifyPassword.press('Enter');

    await page.getByRole('button', { name: 'save' }).click();

    // Check Success Message
    const loggedInMessage = await page.getByText('Password updated successfully');
    await expect(loggedInMessage).toHaveText('Password updated successfully');

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

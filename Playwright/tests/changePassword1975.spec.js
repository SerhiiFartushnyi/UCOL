import { test, expect } from '@playwright/test';
import { login } from '../login';
require('dotenv').config();

/* 
//BEGOERE RUNING THE TESTS
 RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
 RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = process.env.EMAIL1;
const password = process.env.PASSWORD1;

// Change password Flow 
test.beforeEach(async ({ page }) => {

    test.slow();
    
    //Login
    await login(page, email, password);

    // Navigate to site  
    await page.goto('/');

    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');

    // Go to Change Password Page
    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    const profileIcon = page.locator('#profile-toggler-container');
    await page.waitForSelector('#profile-toggler-container');
    await expect(profileIcon).toBeVisible({ timeout: 10000 });
    await profileIcon.click();

    await page.getByRole('link', { name: 'Go to Account Settings' }).click();
    
    //await page.waitForLoadState('networkidle')
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    await page.getByRole('link', { name: 'password' }).click();
    await expect(page.locator('#password-section')).toContainText('password');

    //await page.waitForLoadState('networkidle')
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
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
    await newPassword.fill(password);

    const verifyPassword = page.getByPlaceholder('verify password');
    await verifyPassword.click();
    await verifyPassword.fill(password);
    await verifyPassword.press('Enter');

    await page.getByRole('button', { name: 'save' }).click();

    // Check Success Message
    const loggedInMessage = await page.getByText('Password updated successfully');
    await expect(loggedInMessage).toHaveText('Password updated successfully');
});
import { test, expect } from '@playwright/test';
const config = require('./config');

/* 
//BEGOERE RUNING THE TESTS
 RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
 RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = config.mail;
let password = config.password;

// Change password Flow 
test.beforeEach(async ({ page }) => {

    test.slow();
    await page.goto('/modal/log-in/');

    // Wait for CSRF token to be available
    const csrfToken = await page.getAttribute('input[name="csrfmiddlewaretoken"]', 'value');
    if (!csrfToken) {
        throw new Error('CSRF token not found on the login page');
    }

    // Step 2: Send the pre-login request with extracted CSRF token
    const preLoginResponse = await page.request.post('/modal/log-in/', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': `${config.baseUrl}/modal/log-in/`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
        },
        form: {
            csrfmiddlewaretoken: csrfToken,
            'log_in_view-current_step': 'pre_log_in_form',
            'pre_log_in_form-email': email
        }
    });

    // Log pre-login response details for debugging
    const preLoginBody = await preLoginResponse.text();

    if (!preLoginResponse.ok()) {
        throw new Error('Pre-login request failed');
    }

    // Step 3: Send the final login request
    const loginResponse = await page.request.post('/modal/log-in/', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': `${config.baseUrl}/modal/log-in/`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
        },
        form: {
            csrfmiddlewaretoken: csrfToken,
            'log_in_view-current_step': 'normal_log_in_form',
            'normal_log_in_form-username': email,
            'normal_log_in_form-password': password
        }
    });

    if (!loginResponse.ok()) {
        throw new Error('Login request failed');
    }

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
    await expect(profileIcon).toBeVisible({ timeout: 5000 });
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
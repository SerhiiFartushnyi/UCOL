import { test, expect } from '@playwright/test';
require('dotenv').config();

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

//Reset Password >> Direct click wo entering email
test('Reset Password >> Direct click wo entering email', async ({ page }) => {

    await page.goto('/');

    // Enter the login credentials and Log in
    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();

    // Check popup page
    await expect(page.locator('#auth-modal-content')).toContainText('log in to start creating');

    // Click on Forgot password Button
    await page.getByText('I forgot my password').click();

    const emailField = page.getByPlaceholder('name@workemail.com')
    await emailField.click();
    await emailField.fill(email);
    await page.getByRole('button', { name: 'Send e-mail' }).click();

    // Check if one of the two possible messages is present
    await expect(page.getByText(/We've sent you email with instructions.|You have exceeded the rate limit for sending verification codes. Please try again later or contact the support for help./)).toBeVisible();

    if (await page.getByText('You have exceeded the rate limit for sending verification codes. Please try again later or contact the support for help.').isVisible()) {
        console.log('You have exceeded the rate limit for sending verification codes. Please try again later or contact the support for help.');
        await page.close();
        return; // Exit the test early
    }

    // Wait for a few seconds to ensure the email is sent
    await page.waitForTimeout(5000);

    // Log in to Gmail
    await page.goto('https://mail.google.com/');

    // Find the recovery email
    await page.getByRole('link', { name: 'Restore your password' }).first().click();

    // Extract the recovery link from the email content
    const resetLink = await page.getByRole('link', { name: 'RESET YOUR PASSWORD' }).getAttribute('href');

    console.log('emailContent is ...', resetLink);

    // Navigate to the password reset link
    await page.goto(resetLink);

    await page.waitForSelector('#reset-password-modal');
    
    // Complete the password reset process
    await page.getByPlaceholder('New password').fill(password);
    await page.getByPlaceholder('Confirm password').fill(password);
    await page.getByRole('button', { name: 'Reset password' }).click();

    // Verify the password reset was successful and user is logged in
    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    await page.waitForSelector('#profile-toggler-container');
    await page.locator('#profile-toggler-container').click();
    await expect(page.locator('#profile-container')).toContainText(email);

    // We can go to Gmail And check "Your password has been changed" email 
});
import { test, expect } from '@playwright/test';
const config = require('./config');

//BEGOERE RUNING THE TESTS
// RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
// RUN npx playwright test tests/loginUcol.spec.js

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail;
const password = config.password;

// Forgot Password Flow
test.skip ('Forgot Password Flow', async ({ page }) => {
    await page.goto('/');

        //await page.pause();
    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();    
    await page.getByPlaceholder('enter your e-mail address').fill(mail);

    // Login with not correct password
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password+1);
    await page.getByRole('button', { name: 'Log in' }).click();

    //Check error message
    const textElement = await page.getByText('Please enter a correct email');
    await expect(textElement).toContainText('Please enter a correct email and password. Note that both fields may be case-sensitive.');
    
    //Click on Forgot password Button
    await page.getByText('I forgot my password').click();
    
    //Check Forgot passwor Message
    await expect(page.locator('#auth-modal-content')).toContainText('Forgot your password?');
    await page.getByPlaceholder('name@workemail.com').click();
   
    // fill in the email field and click on the Send e-mail button
    await page.getByPlaceholder('name@workemail.com').fill('serhii.fartushnyi+ucl@coaxsoft.com');
    await page.getByRole('button', { name: 'Send e-mail' }).click();

    // Check if one of the two possible messages is present

    await expect(page.getByText(/We've sent you email with instructions.|You have exceeded the rate limit for sending verification codes. Please try again later or contact the support for help./)).toBeVisible();
    
    if (await page.getByText('You have exceeded the rate limit for sending verification codes. Please try again later or contact the support for help.').isVisible()) {
        page.close();
        return; // Exit the test early
  } else {
/*
If your flow includes email verification, Playwright’s API can interact with an email service API 
to retrieve the reset link for further actions. This kind of setup typically involves using 
third-party libraries or tools to read and extract content from email messages.

For example, you can use the Gmail API to retrieve the email with the reset link.

>> Here implemented intedaction with Gmail UI 
*/
    await page.waitForTimeout(30000);
    await page.goto('https://mail.google.com/mail/u/0/#inbox');

    await page.getByRole('link', { name: 'Restore your password  -' }).click();

    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'RESET YOUR PASSWORD' }).click();
    const page1 = await page1Promise;

    await page1.getByPlaceholder('new password').click();

    await page1.getByRole('button', { name: 'Reset password' }).click();
    await page1.getByPlaceholder('new password').fill('Qwert12345!');
    await page1.getByPlaceholder('confirm password').click();
    await page1.getByPlaceholder('confirm password').fill('Qwert12345!');
    // Check if User is logged in 
    await expect(page1.getByText('Design professional')).toBeVisible();}

    // Also we can check if user is able to lok in with new password
});

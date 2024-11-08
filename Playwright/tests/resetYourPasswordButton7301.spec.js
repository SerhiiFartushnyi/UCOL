import { test, expect } from '@playwright/test';
const config = require('./config');

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail;

//Reset Password >> Direct click wo entering email
test.skip('Reset Password >> Direct click wo entering email', async ({ page }) => {

    await page.goto('/');

    // Enter the login credentials and Log in
    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();

    // Check popup page
    await expect(page.locator('#auth-modal-content')).toContainText('log in to start creating');

    // Click on Forgot password Button
    await page.getByText('I forgot my password').click();


    await page.getByPlaceholder('name@workemail.com').click();
    await page.getByPlaceholder('name@workemail.com').fill(mail);
    await page.getByRole('button', { name: 'Send e-mail' }).click();

    //Check Popup message
    await expect(page.locator('#auth-modal-content')).toContainText('We\'ve sent you email with instructions.');

    await page.waitForTimeout(7000);

    await page.goto('https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox');

    await page.getByText('support').nth(1).click
    await page.getByRole('gridcell', { name: 'support', exact: true }).click()

    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'RESET YOUR PASSWORD' }).click();
    const page1 = await page1Promise;


    await page1.getByPlaceholder('new password').click();
    await page1.getByPlaceholder('new password').fill('Qwert12345!');
    await page1.getByRole('img').nth(1).click();
    await page1.getByPlaceholder('confirm password').click();
    await page1.getByPlaceholder('confirm password').fill('Qwert12345!');
    await page1.getByRole('button', { name: 'Reset password' }).click();

    // Check Email for the confirmation ))
    await page.goto('https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox'); 

    await page.getByRole('link', { name: 'Your password has been' }).click();
    await expect(page.getByRole('listitem')).toContainText('Your password has been successfully changed');

    await page.goto('/')

    // Used the saved email from the config file
    // await page.getByPlaceholder('enter your e-mail address').fill(mail);

    // await page.getByRole('button', { name: 'Log in' }).click();
    // await page.getByPlaceholder('8 char. +1 symbol, number,').click();
    // await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password);
    // await page.getByRole('button', { name: 'Log in' }).click();

});
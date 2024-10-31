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
test.skip('Forgot Password Flow', async ({ page }) => {
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

    // //Check Forgot passwor Message 
    // await expect(page.locator('#auth-modal-content')).toContainText('We\'ve sent you email with instructions.');

    // Check if one of the two possible messages is present
    const messageLocator = page.locator('#auth-form-content');
    // const messageLocator = page.getByText('You have exceeded the rate')


    //getByText('You have exceeded the rate')

    await expect(messageLocator).toBeVisible();

  
    const messageText = await messageLocator.textContent();
    console.log('Message text:', messageText);

    const isMessageCorrect = messageText.includes("We've sent you email with instructions.") ||
                            messageText.includes("You have exceeded the rate limit for sending verification codes. Please try again later or contact the support for help.");

    await expect(isMessageCorrect).toBe(true);

    // Check the email with the instructions

    await page.goto('https://mail.google.com/mail/u/0/#inbox');


    await page.goto('/');

});
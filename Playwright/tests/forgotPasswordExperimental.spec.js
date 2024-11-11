import { test, expect } from '@playwright/test';
const config = require('./config');
const axios = require('axios');

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const mail = config.mail;
const password = config.password;

// Forgot Password Flow
//test.skip ('Forgot Password Flow', async ({ page }) => {
//     await page.goto('/');

//         //await page.pause();
//     await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
//     await page.getByPlaceholder('enter your e-mail address').click();    
//     await page.getByPlaceholder('enter your e-mail address').fill(mail);

//     // Login with not correct password
//     await page.getByRole('button', { name: 'Log in' }).click();
//     await page.getByPlaceholder('8 char. +1 symbol, number,').click();
//     await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password+1);
//     await page.getByRole('button', { name: 'Log in' }).click();

//     //Check error message
//     const textElement = await page.getByText('Please enter a correct email');
//     await expect(textElement).toContainText('Please enter a correct email and password. Note that both fields may be case-sensitive.');
    
//     //Click on Forgot password Button
//     await page.getByText('I forgot my password').click();
    
//     //Check Forgot passwor Message
//     await expect(page.locator('#auth-modal-content')).toContainText('Forgot your password?');
//     await page.getByPlaceholder('name@workemail.com').click();
   
//     // fill in the email field and click on the Send e-mail button
//     await page.getByPlaceholder('name@workemail.com').fill('serhii.fartushnyi+ucl@coaxsoft.com');
//     await page.getByRole('button', { name: 'Send e-mail' }).click();

//     // Check if one of the two possible messages is present

//     await expect(page.getByText(/We've sent you email with instructions.|You have exceeded the rate limit for sending verification codes. Please try again later or contact the support for help./)).toBeVisible();
    
//     if (await page.getByText('You have exceeded the rate limit for sending verification codes. Please try again later or contact the support for help.').isVisible()) {
//         page.close();
//         return; // Exit the test early
//   } else {
// /*
// If your flow includes email verification, Playwright’s API can interact with an email service API 
// to retrieve the reset link for further actions. This kind of setup typically involves using 
// third-party libraries or tools to read and extract content from email messages.

// For example, you can use the Gmail API to retrieve the email with the reset link.

// >> Here implemented intedaction with Gmail UI 
// */
//     await page.waitForTimeout(30000);
//     await page.goto('https://mail.google.com/mail/u/0/#inbox');

//     await page.getByRole('link', { name: 'Restore your password  -' }).click();

//     const page1Promise = page.waitForEvent('popup');
//     await page.getByRole('link', { name: 'RESET YOUR PASSWORD' }).click();
//     const page1 = await page1Promise;

//     await page1.getByPlaceholder('new password').click();

//     await page1.getByRole('button', { name: 'Reset password' }).click();
//     await page1.getByPlaceholder('new password').fill('Qwert12345!');
//     await page1.getByPlaceholder('confirm password').click();
//     await page1.getByPlaceholder('confirm password').fill('Qwert12345!');
//     // Check if User is logged in 
//     await expect(page1.getByText('Design professional')).toBeVisible();}

//     // Also we can check if user is able to lok in with new password
// });

// Replace with your Mailinator API key
const MAILINATOR_API_KEY = 'your_mailinator_api_key';

// Helper function to retrieve email from Mailinator
async function getResetEmail(inbox) {
  const response = await axios.get(`https://api.mailinator.com/v2/inbox?to=${inbox}`, {
    headers: { 'Authorization': `Bearer ${MAILINATOR_API_KEY}` }
  });
  
  // Find the reset email (assuming the latest email in the inbox is the one you want)
  const messages = response.data.messages;
  if (messages.length === 0) {
    throw new Error("No emails found in Mailinator inbox.");
  }

  // Retrieve the specific message
  const messageId = messages[0].id;
  const messageResponse = await axios.get(`https://api.mailinator.com/v2/domains/public/inboxes/${inbox}/messages/${messageId}`, {
    headers: { 'Authorization': `Bearer ${MAILINATOR_API_KEY}` }
  });

  return messageResponse.data.data.parts[0].body;
}

test.skip('Forgot Password flow with Mailinator email verification', async ({ page }) => {
  // Generate a unique inbox name for this test
  const inbox = `test-inbox-${Math.floor(Math.random() * 10000)}`;
  const email = `${inbox}@mailinator.com`;

  // Navigate to the login page
  await page.goto('https://ucl-coolab-dev.uk.r.appspot.com/');

  // Click on the "Forgot Password" link
  await page.getByText('I forgot my password').click();

  // Check Forgot password Message
  await expect(page.locator('#auth-modal-content')).toContainText('Forgot your password?');
  await page.getByPlaceholder('name@workemail.com').click();

  // Fill in the email field and click on the Send e-mail button
  await page.getByPlaceholder('name@workemail.com').fill(email);
  await page.getByRole('button', { name: 'Send e-mail' }).click();

  // Check if one of the two possible messages is present
  await expect(page.getByText(/We've sent you email with instructions.|You have exceeded the rate limit for sending verification codes. Please try again later or contact the support for help./)).toBeVisible();

  if (await page.getByText('You have exceeded the rate limit for sending verification codes. Please try again later or contact the support for help.').isVisible()) {
    await page.close();
    return; // Exit the test early
  }

  // Wait and retrieve the reset email from Mailinator (polling every 5 seconds for up to 30 seconds)
  let emailContent;
  for (let i = 0; i < 6; i++) {
    try {
      emailContent = await getResetEmail(inbox);
      if (emailContent) break;
    } catch (error) {
      // Wait 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  if (!emailContent) {
    throw new Error("Password reset email not received.");
  }

  // Extract the reset link from the email content
  const resetLink = emailContent.match(/https:\/\/[^\s]+/)[0];

  // Navigate to the password reset link
  await page.goto(resetLink);

  // Complete the password reset process
  await page.fill('input[name="newPassword"]', 'NewSecurePassword123!');
  await page.click('button[type="submit"]');

  // Verify the password reset was successful
  await expect(page.locator('text="Your password has been reset"')).toBeVisible();
});

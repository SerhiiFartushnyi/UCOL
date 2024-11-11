import { test, expect } from '@playwright/test';
const config = require('./config');

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = config.mail;
const password = config.password;
// let password = config.password1;


test.skip ('Forgot Password flow with Gmail email verification', async ({ page }) => {

  // Navigate to the forgot password page
  await page.goto('/');
  await page.locator('#profile').getByRole('paragraph').getByText('log in').click();

    //Click on Forgot password Button
    await page.getByText('I forgot my password').click();
    await page.getByPlaceholder('name@workemail.com').click();
    await page.getByPlaceholder('name@workemail.com').fill(email);
    await page.getByRole('button', { name: 'Send e-mail' }).click();


  // Check if one of the two possible messages is present
  await expect(page.getByText(/We've sent you email with instructions.|You have exceeded the rate limit for sending verification codes. Please try again later or contact the support for help./)).toBeVisible();

  if (await page.getByText('You have exceeded the rate limit for sending verification codes. Please try again later or contact the support for help.').isVisible()) {
    await page.close();
    return; // Exit the test early
  }

  // Wait for a few seconds to ensure the email is sent
  await page.waitForTimeout(10000);

  // Log in to Gmail
  await page.goto('https://mail.google.com/');

  // Find the recovery email
  await page.getByRole('link', { name: 'Restore your password' }).first().click();

  // Extract the recovery link from the email content
  //const emailContent = await page.locator('div[role="main"]').innerText();
  const emailContent = await page.getByRole('link', { name: 'RESET YOUR PASSWORD' }).innerText();

  const resetLink = emailContent.match(/https:\/\/[^\s]+/);
  console.log('resetLink is ...', resetLink);

  // Navigate to the password reset link
  await page.goto(resetLink);

  // Complete the password reset process
  await page.getByPlaceholder('New password').fill(password);
  await page.getByPlaceholder('Confirm new password').fill(password);
  await page.getByRole('button', { name: 'Reset password' }).click();

  // Verify the password reset was successful
  await expect(page.getByText('Your password has been reset')).toBeVisible();

});
const { test, expect } = require('@playwright/test');
const axios = require('axios');
const config = require('../tests/config');

// const inbox = config.mail2;

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

// Replace with your MailJet API credentials
const MAILJET_API_KEY = 'cf3e397609206a91e8038fadd3166286';
const MAILJET_API_SECRET = 'f19dc971809e9f2e999d6b0857d54914';

// Helper function to retrieve email from MailJet
async function getResetEmail(inbox) {
  const response = await axios.get(`https://api.mailjet.com/v3/REST/message?To=${inbox}`, {
    auth: {
      username: MAILJET_API_KEY,
      password: MAILJET_API_SECRET
    }
  });

  // Find the reset email (assuming the latest email in the inbox is the one you want)
  const messages = response.data.Data;
  if (messages.length === 0) {
    throw new Error("No emails found in MailJet inbox.");
  }

  // Retrieve the specific message
  const messageId = messages[0].ID;
  const messageResponse = await axios.get(`https://api.mailjet.com/v3/REST/message/${messageId}`, {
    auth: {
      username: MAILJET_API_KEY,
      password: MAILJET_API_SECRET
    }
  });
  
  return messageResponse.data.TextPart;
}

test.skip ('Forgot Password flow with MailJet email verification', async ({ page }) => {
  // Generate a unique inbox name for this test
//   const inbox = `test-inbox-${Math.floor(Math.random() * 10000)}@yourdomain.com`;
//   const email = inbox;
    const email = config.mail2;

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

  // Wait and retrieve the reset email from MailJet (polling every 5 seconds for up to 30 seconds)
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
  await page.getByPlaceholder('New password').fill('NewSecurePassword123!');
  await page.getByPlaceholder('Confirm new password').fill('NewSecurePassword123!');
  await page.getByRole('button', { name: 'Reset password' }).click();

  // Verify the password reset was successful
  await expect(page.getByText('Your password has been reset')).toBeVisible();
});
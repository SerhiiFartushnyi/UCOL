import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
const config = require('../tests/config');

// const randomName = faker.person.firstName();
// const randomSurname = faker.person.lastName();

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

// Replace with your MailJet API credentials
const MAILJET_API_KEY = 'cf3e397609206a91e8038fadd3166286';
const MAILJET_API_SECRET = 'f19dc971809e9f2e999d6b0857d54914';

// Helper function to retrieve email from MailJet
async function getVerificationCode(inbox) {
  const response = await axios.get(`https://api.mailjet.com/v3/REST/message?To=${inbox}`, {
    auth: {
      username: MAILJET_API_KEY,
      password: MAILJET_API_SECRET
    }
  });

  // Find the verification email (assuming the latest email in the inbox is the one you want)
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

  // Extract the verification code from the email content
  const emailContent = messageResponse.data.TextPart;
  const verificationCode = emailContent.match(/\b\d{6}\b/)[0]; // Assuming the verification code is a 6-digit number

  return verificationCode;
}

test.skip('Sign Up With MailJet', async ({ page }) => {

    const randomName = faker.person.firstName();
    const randomSurname = faker.person.lastName();
 
  const randomEmail = `serhii.fartushnyi+${Math.floor(Math.random() * 10000)}@coaxsoft.com`;

  await page.goto('/');
  await page.getByText('sign up').click();
  await page.getByPlaceholder('enter your e-mail address').click();
  await page.getByPlaceholder('enter your e-mail address').fill(randomEmail);

  await page.getByPlaceholder('8 char. +1 symbol, number,').click();
  await page.getByPlaceholder('8 char. +1 symbol, number,').fill('Qwert1234!');
  await page.getByPlaceholder('confirm your password').click();
  await page.getByPlaceholder('confirm your password').fill('Qwert1234!');
  await page.getByRole('button', { name: 'Next' }).click();

  // Check Popup to be visible
  await expect(page.getByText('Enter your name')).toBeVisible();

  // Fill the User Full Name
  await page.getByPlaceholder('enter your first name').click();
  await page.getByPlaceholder('enter your first name').fill(randomName);
  await page.getByPlaceholder('enter your last name').click();
  await page.getByPlaceholder('enter your last name').fill(randomSurname);
  await page.getByRole('button', { name: 'Next' }).click();

  // Check Popup to be visible
  await expect(page.getByText('Get verified')).toBeVisible();

  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('#auth-form')).toContainText('Incorrect token used. Please try again.');
  await expect(page.locator('#auth-form')).toContainText('This field is required.');

  // Wait and retrieve the verification code from MailJet (polling every 5 seconds for up to 30 seconds)
  let verificationCode;
  for (let i = 0; i < 6; i++) {
    try {
      verificationCode = await getVerificationCode(randomEmail);
      if (verificationCode) break;
    } catch (error) {
      // Wait 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  if (!verificationCode) {
    throw new Error("Verification code not received.");
  }

  console.log(`Retrieved verification code: ${verificationCode}`);

  await page.getByPlaceholder('Verification code').click();
  await page.getByPlaceholder('Verification code').fill(verificationCode);
  await page.getByRole('button', { name: 'Next' }).click();
  //await expect(page.locator('#auth-form')).toContainText('Incorrect token used. Please try again.');
});
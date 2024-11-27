import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';


/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

test.use({ storageState: 'auth.json' });

test('Sign Up Wrong Email', async ({ page }) => {
    await page.goto('/');
    await page.getByText('sign up').click();

    const emailField = page.getByPlaceholder('enter your e-mail address');
    await emailField.click();
    await emailField.fill('far2shok');
    
    const passwordField = page.getByPlaceholder('8 char. +1 symbol, number,');
    await passwordField.click();
    await passwordField.fill('Qwert1234!');

    const confirmPasswordField = page.getByPlaceholder('confirm your password');
    await confirmPasswordField.click();
    await confirmPasswordField.fill('Qwert1234!');
    await page.getByRole('button', { name: 'Next' }).click();
    

    // Invalid email format error
    await expect(page.locator('#auth-form')).toContainText('Enter a valid email address.');
});

test('Sign Up Passwords Does not match ', async ({ page }) => {

    await page.goto('/');
    await page.getByText('sign up').click();

    
    await page.getByPlaceholder('enter your e-mail address').click();
    await page.getByPlaceholder('enter your e-mail address').fill('far2shok@test.com');
    await page.getByPlaceholder('8 char. +1 symbol, number,').click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill('Qwert1234!');
    await page.getByPlaceholder('confirm your password').click();
    await page.getByPlaceholder('confirm your password').fill('Qwert12345!');
    await page.getByRole('button', { name: 'Next' }).click();

    // Passwords do not match error
    await expect(page.locator('#auth-form')).toContainText('The two password fields didn’t match.');
});

test('Sign Up >> No Verification code', async ({ page }) => {

    const randomName = faker.person.firstName();
    const randomSurname = faker.person.lastName();

    await page.goto('/');
    await page.getByText('sign up').click();
    await page.getByPlaceholder('enter your e-mail address').click();
    await page.getByPlaceholder('enter your e-mail address').fill('far2shok@yahoo.com');

    await page.getByPlaceholder('8 char. +1 symbol, number,').click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill('Qwert1234!');
    await page.getByPlaceholder('confirm your password').click();
    await page.getByPlaceholder('confirm your password').fill('Qwert1234!');
    await page.getByRole('button', { name: 'Next' }).click();

    // Check Popup to be visible
    await expect(page.getByText('Enter your name')).toBeVisible({timeout: 10000});

    // Fill the User Full Name
    await page.getByPlaceholder('enter your first name').click();
    await page.getByPlaceholder('enter your first name').fill(randomName);
    await page.getByPlaceholder('enter your last name').click();
    await page.getByPlaceholder('enter your last name').fill(randomSurname);
    await page.getByRole('button', { name: 'Next' }).click();

    // Check Popup to be visible
    await expect(page.getByText('Get verified')).toBeVisible({timeout: 10000});

    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.locator('#auth-form')).toContainText('Incorrect token used. Please try again.');
    await expect(page.locator('#auth-form')).toContainText('This field is required.');

    await page.getByPlaceholder('Verification code').click();
    await page.getByPlaceholder('Verification code').fill('123456');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.locator('#auth-form')).toContainText('Incorrect token used. Please try again.');
});

test.skip('Sign Up With Gmail', async ({ page }) => {

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

    const [gmailPage] = await Promise.all([
        page.context().newPage(),
        page.waitForTimeout(2000) // Ensure some delay if needed for network speed
    ]);
    await gmailPage.goto('https://mail.google.com');

    // Log in to Gmail
    //   await gmailPage.getByPlaceholder('Email or phone').fill(randomEmail);
    //   await gmailPage.getByRole('button', { name: 'Next' }).click();
    //   await gmailPage.getByPlaceholder('Enter your password').fill('your-email-password');
    //   await gmailPage.getByRole('button', { name: 'Next' }).click();

    // Extract the verification code from the email content
    await gmailPage.getByRole('link', { name: 'Email Verification' }).first().click();
    const emailContent = await gmailPage.getByText(/Your verification code: \d+/).last().innerText();
    const verificationCode = emailContent.match(/\d+/)[0];
    console.log('Verification code:', verificationCode);
    
    // Close the Gmail page
    await gmailPage.close();

    // Switch back to the main page
    await page.bringToFront();
    await page.waitForTimeout(5000);

    // Enter the verification code
    await page.getByPlaceholder('Verification code').click();
    await page.getByPlaceholder('Verification code').fill(verificationCode);
    await page.getByRole('button', { name: 'Next' }).click();

    // Fill the User Role
    await expect(page.getByText('What are you using coolab for?')).toBeVisible();
    await page.locator('.select-selected').click();

    // Hardcoded random roles for now
    const roles = ['Marketing / Agency', 'Small Business', 'Enterprise', 'Content Creator', 'Student', 'Personal'];
    const role = roles[Math.floor(Math.random() * roles.length)];

    // Finish the sign-up process 
    await page.locator('.select-items').filter({ hasText: new RegExp(role) }).click();
    await page.getByRole('button', { name: 'finish' }).click();

    // Check The Users Email
    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    await page.waitForSelector('#profile-toggler');
    await page.locator('#profile-toggler').click();
    await expect(page.locator('#profile-container')).toContainText(randomEmail);
    await expect(page.getByText('Design professional')).toBeVisible();
});



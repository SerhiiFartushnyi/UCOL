import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { login } from '../login';
require('dotenv').config();

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = process.env.EMAIL2;
const password = process.env.PASSWORD2;

// Generate random names using Faker
const randomName = faker.person.firstName();
const randomSurname = faker.person.lastName();

// Update Progile

test('Update Profile', async ({ page }) => {

    test.slow();
    
    //Login
    await login(page, email, password);

    // Navigate to site  
    await page.goto('/');
    
    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');

    //await page.waitForLoadState('networkidle');
    await page.waitForSelector('#profile-toggler-container');
    await page.locator('#profile-toggler-container').click();

    await page.getByRole('link', { name: 'Go to Account Settings' }).click();

    // Check if I am on Account page 
    await expect(page.getByText('Account', { exact: true })).toBeVisible();
    await page.locator('#full_name').click();

    // Update the User Full Name
    // Check Popup to be visible
    await expect(page.getByText('update profile')).toBeVisible({ timeout: 10000 });

    await page.locator('input[name="first_name"]').fill(randomName);
    await page.locator('input[name="last_name"]').fill(randomSurname);
    await page.locator('input[name="username"]').fill(randomName + randomSurname);
    await page.locator('input[name="username"]').press(' ')

    // Check the Save button to be visible and click it
    await expect(page.locator('#profile-info-submit-btn', { hasText: 'save' })).toBeVisible({ timeout: 10000 });
    await page.locator('#profile-info-submit-btn', { hasText: 'save' }).click();

    // Test Success Message
    const loggedInMessage = await page.getByText('Profile updated successfully.');
    await expect(loggedInMessage).toHaveText('Profile updated successfully.');

    // Test updated User Full Name
    await expect(page.locator('#full_name')).toHaveText(randomName + ' ' + randomSurname);

});


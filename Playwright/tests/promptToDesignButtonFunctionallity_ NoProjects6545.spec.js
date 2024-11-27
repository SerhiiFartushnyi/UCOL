// Page Will Be updated soon !!!!
import { test, expect } from '@playwright/test';
import { login } from '../login';
require('dotenv').config();

/*
BEFOERE RUNING THE TESTS
RUN node saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = process.env.EMAIL2;
const password = process.env.PASSWORD2;

test('Prompt To Design Button Functionallity', async ({ page }) => {
    test.slow();
    
    // Login
    await login(page, email, password);

    // Navigate to site  
    await page.goto('/');

    // Check if the user is logged in
    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    await page.waitForSelector('#profile-toggler-container');
    const profile = page.locator('#profile-toggler-container');
    await expect(profile).toBeVisible();
    await profile.click();

    // Click on Project Button
    await expect(page.getByRole('link', { name: 'Go to Projects' })).toBeVisible();
    await page.getByRole('link', { name: 'Go to Projects' }).click();

    // User without projects should see the message
   await expect(page.locator('#projects-tab-content')).toContainText('start a new project');

    // Ensure the add new project button is visible and enabled
    const newDesignButton = page.locator('#add-new-project-btn')
    await expect(newDesignButton).toBeVisible({ timeout: 10000 });
    await expect(newDesignButton).toBeEnabled();

    //Hover over the button and click on the prompt to design button
    await newDesignButton.dispatchEvent('mouseover');
    await page.getByRole('link', { name: ' Prompt-to-Design ', exact: true}).click({force: true});

    await expect(page.getByText('what would you like to')).toBeVisible({ timeout: 10000 });
});
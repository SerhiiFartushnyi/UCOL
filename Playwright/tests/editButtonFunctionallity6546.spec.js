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

const email = process.env.EMAIL1;
const password = process.env.PASSWORD1;

test('Edit Button Functionallity', async ({ page }) => {
    
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

    const profileIcon = page.locator('#profile-toggler-container');
    await page.waitForSelector('#profile-toggler-container');
    await expect(profileIcon).toBeVisible({ timeout: 10000 });
    await profileIcon.click();

    // Click on Project Button
    const projectButton = await page.getByRole('link', { name: 'Go to Projects' });
    await expect(projectButton).toBeVisible({ timeout: 10000 });
    await projectButton.click();
    
   // Go to Projects and click on first project
    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    await expect(page.locator('#projects-container')).toContainText('Edit');
    
    // Check if the dark theme button exists
const darkThemeButton = page.locator('.edit-btn-container-darkened').first();
const normalThemeButton = page.locator('.edit-btn-container').first();

if (await darkThemeButton.count() > 0) {
    // Click the dark theme button if it exists
    await darkThemeButton.click();
} else {
    // Click the normal theme button if the dark theme button does not exist
    await normalThemeButton.click();
}
    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    // Check if the user Pedirected to The Scene Page and Project is opened
    expect(page.url()).toContain('/tool/scene');

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    await page.waitForSelector('[id="projectBtn\\""]');
    await expect(page.locator('[id="projectBtn\\""]')).toContainText('Projects');
    await expect(page.locator('button[name="librarydock-my-templates-entry"]')).toContainText('Templates');
    await expect(page.locator('#root')).toContainText('Feedback');

});
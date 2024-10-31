import { test, expect } from '@playwright/test';
const config = require('./config');

/* 
 // Define the flag to skip beforeEach for specific tests
 let skipBeforeEach = false;

//BEGOERE RUNING THE TESTS
 RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
 RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = config.mail1;
let password = config.password1;

test('Edit Button Functionallity', async ({ page }) => {
    
    await page.goto('/');
    // Enter the login credentials and Log in
    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();

    // Used the saved email from the config file
    await page.getByPlaceholder('enter your e-mail address').fill(email);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();

    // Check if the user is logged in
    await expect(page.getByRole('img', { name: 'Avatar profile' })).toBeVisible();

    await page.waitForLoadState('networkidle');
    await page.getByRole('img', { name: 'Avatar profile' }).click();

    // Click on Project Button
    await expect(page.getByRole('link', { name: 'Go to Projects' })).toBeVisible();
    await page.getByRole('link', { name: 'Go to Projects' }).click();

   // Go to Projects and click on first project
    await expect(page.locator('#projects-container')).toContainText('Edit');
    //await page.locator('#projects-container').click();

    //await page.locator('.edit-btn-container-darkened').first().click();
    

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
    await page.waitForLoadState('networkidle');
    // Check if the user Pedirected to The Scene Page and Project is opened
    expect(page.url()).toContain('/tool/scene');

    await expect(page.locator('[id="projectBtn\\""]')).toContainText('Projects');
    await expect(page.locator('button[name="librarydock-my-templates-entry"]')).toContainText('Templates');
    await expect(page.locator('#root')).toContainText('Feedback');

});
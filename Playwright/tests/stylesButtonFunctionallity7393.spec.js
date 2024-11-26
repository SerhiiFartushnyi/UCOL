import { test, expect } from '@playwright/test';
import { login } from '../login';
require('dotenv').config();

/*
BEFOERE RUNING THE TESTS
RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

// Stiles Button Functionallity
test('Styles Button Func', async ({ page }) => {
    test.slow();
    
    //Login
    await login(page, email, password);

    // Navigate to site  
    await page.goto('/');

    //Assertions to check if the user is logged in
    await page.waitForSelector('body');
    await expect(page.locator('body')).toContainText('Design professional');

    await page.getByRole('link', { name: 'templates', exact: true }).click();
    await expect(page.locator('h4')).toContainText('styles');

    // Choose a random style
    const styles = page.locator('#genres-list > li.rounded-lg');
    // Get the text of all the styles
    const stylesTextArray = await styles.evaluateAll(elements => 
    elements.map(element => element.querySelector('a').textContent.trim())
);
    // Click on a random style

    const randomIndex = Math.floor(Math.random() * stylesTextArray.length);
    const randomStyle = stylesTextArray[randomIndex];

    await page.getByRole('link', { name: randomStyle }).click();

    console.log('RandomStyle:', randomStyle);
    // Check if the random style Heding is visible
    await expect(page.getByRole('heading', { name: randomStyle })).toBeVisible({ timeout: 10000 });

});
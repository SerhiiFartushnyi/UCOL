import { test, expect } from '@playwright/test';

//BEGOERE RUNING THE TESTS
// RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
// RUN npx playwright test tests/loginUcol.spec.js

// Use the saved authentication state
test.use({ storageState: 'auth.json' });


test('Use this template NOT Logged in User', async ({ page }) => {

    await page.goto('/');

    const template = page.getByRole('link', { name: 'templates', exact: true });
    await expect(template).toBeVisible();
    await template.click();

    // Check page  
    await expect(page.getByText('WELCOME TO SCENE')).toBeVisible();
    expect(page.url()).toContain('/templates/');

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
    
    // Click on first template

    await page.waitForLoadState('networkidle');
    await page.locator('.infinite-item > .relative > .w-full').first().click();
    await page.getByRole('link', { name: 'use this template' }).click();

    // Check Login Text
    await expect(page.getByText('log in to start creating')).toBeVisible();
    // Check URL
    expect(page.url()).toContain('/log-in/');
});
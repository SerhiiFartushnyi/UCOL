import { test, expect } from '@playwright/test';

/*
BEFOERE RUNING THE TESTS
RUN node saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });


test('Use this template NOT Logged in User', async ({ page }) => {

    await page.goto('/');

    const template = page.getByRole('link', { name: 'templates', exact: true });
    await expect(template).toBeVisible();
    await template.click();

    // Check page  
    await expect(page.getByText('WELCOME TO SCENE')).toBeVisible({ timeout: 10000 });
    expect(page.url()).toContain('/templates/');

    // Choose a random style
    await page.waitForSelector('#genres-list > li.rounded-lg');
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
    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    await page.waitForSelector('.infinite-item > .relative > .w-full');
    await page.locator('.infinite-item > .relative > .w-full').first().click();
    await page.locator('#modalEditorUrl').click();

    // Check Login Text
    await expect(page.getByText('log in to start creating')).toBeVisible({ timeout: 10000 });
});
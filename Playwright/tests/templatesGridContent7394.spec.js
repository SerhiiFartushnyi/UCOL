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

test('Template Grid Content', async ({ page }) => {
    test.slow();

    //Login
    await login(page, email, password);

    // Navigate to site  
    await page.goto('/');
    
    //Assertions to check if the user is logged in
    await expect(page.locator('body')).toContainText('Design professional');

    const template = page.getByRole('link', { name: 'templates', exact: true });
    await expect(template).toBeVisible({ timeout: 10000 });
    await template.click();

    // Check page  
    await expect(page.getByText('WELCOME TO SCENE')).toBeVisible({ timeout: 10000 });
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

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }

    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });

    const allTemplates = page.getByText('all templates loaded');
    await expect(allTemplates).toBeVisible({ timeout: 10000 });

    const otherGenres = page.getByText(' / OTHER GENRES YOU MAY LIKE')
    await otherGenres.scrollIntoViewIfNeeded();
    await expect(otherGenres).toBeVisible({ timeout: 10000 });

    //Check if the recommended and alternative templates are visible

    await page.waitForSelector('#recommended-arles');
    const locator1 = page.locator('#recommended-arles');
    await page.waitForSelector('#recommended-bahaus');
    const locator2 = page.locator('#recommended-bahaus');


    const isLocator1Visible = await locator1.isVisible();
    const isLocator2Visible = await locator2.isVisible();

  if (isLocator1Visible) {
    await locator1.scrollIntoViewIfNeeded();
    await locator1.click();
    console.log('Locator 1 is visible and scrolled into view');
  } else if (isLocator2Visible) {
    await locator2.scrollIntoViewIfNeeded();
    await locator2.click();
    console.log('Locator 2 is visible and scrolled into view');
  } else {
    throw new Error('Neither locator is visible');
  }

    //Check More and Less button
    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }

    const moreButton = page.getByRole('button', { name: 'More' });
    await expect(moreButton).toBeVisible({ timeout: 10000 });
    await moreButton.click();
    
    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    const lessButton = page.getByRole('button', { name: 'Less' });
    await expect(lessButton).toBeVisible();
    await lessButton.click();

    // Click on random template
    const templates = page.locator('.infinite-item > .relative > .w-full');
    const templatesCount = await templates.count();
    const randomTemplateIndex = Math.floor(Math.random() * templatesCount);
    await templates.nth(randomTemplateIndex).click();

    // Check if the Name is visible
    await page.locator('#modalName').isVisible({ timeout: 10000 });
    // Check if the Image is visible
    await page.locator('#modalImage').isVisible();
    // Check if the "use this template" button is visible

    await expect(page.getByRole('link', { name: 'use this template' })).toBeVisible({ timeout: 10000 });
    // Check if the "add to favorites" button is visible
    await expect(page.locator('#addToFavoritesBtn')).toBeVisible();
    // Check if 'You might also like' section is visible
    await expect(page.getByText('You might also like')).toBeVisible();

    // Click on a random recommended template
    const recommended = page.locator('#modalRecommended > div');
    const recommendedCount = await recommended.count();
    console.log(recommendedCount);
    const randomRecomendedIndex = Math.floor(Math.random() * recommendedCount);
    await recommended.nth(randomRecomendedIndex).click();
    

    // IF Button is disabled than choose another template
    const disabledButton = page.getByRole('link', { name: 'use this template' })
    const disabledClass = await disabledButton.getAttribute('class');
        if (disabledClass.includes('disabled')) {
        console.log('Button is disabled');
            const recommended = page.locator('#modalRecommended > div');
            const recommendedCount = await recommended.count();
            const randomRecomendedIndex = Math.floor(Math.random() * recommendedCount);
            await recommended.nth(randomRecomendedIndex).click();

        }

    await page.getByRole('link', { name: 'use this template' }).click();

    const currentUrl = page.url();
    expect(currentUrl).toContain('/tool/scene/');
});

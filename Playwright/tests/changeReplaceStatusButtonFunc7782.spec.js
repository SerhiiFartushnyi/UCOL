import { test, expect } from '@playwright/test';
import { login } from '../login';
require('dotenv').config();

//BEGOERE RUNING THE TESTS
// RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
// RUN npx playwright test tests/loginUcol.spec.js

// Use the saved authentication state

test.use({ storageState: 'auth.json' });

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

// Change replace Status Button Functionallity
test('Change replace Status Button Functionallity ', async ({ page }) => {
    test.slow();
    
    // Login
    await login(page, email, password);

    // Navigate to site  
    await page.goto('/');
    //Assertions to check if the user is logged in
    await page.waitForSelector('body');
    await expect(page.locator('body')).toContainText('Design professional');

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }

    // Go To Scene Tab
    await page.getByText('features', { exact: true }).click();
    await page.getByRole('link', { name: 'format extender' }).click();

    await page.getByRole('link', { name: 'start now' }).first().click();

    //Click on the Layers tab
    await page.locator('#layers').click();
    await expect(page.locator('.genre-assets-topbar--title')).toContainText('layers');

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    const layersComponent = page.locator('#scrollableDiv .genre-assets-content--content--assets-container--asset')
    const numberOfLayers = await layersComponent.count();

    //console.log('numberOfLayers counted: ', numberOfLayers);
    const randomLayerIndex = Math.floor(Math.random() * numberOfLayers);
    const randomLayer = layersComponent.nth(randomLayerIndex);

    console.log('clicked on randomLayerIndex: ', randomLayerIndex);
    await randomLayer.click();

    // Assertion to check if layer set as replaceable/replaceable
    await page.getByText('change replaceable status').click();
    await expect(page.getByText(/New assets set as (irreplaceable|replaceable)/)).toBeVisible({ timeout: 10000 });

    await randomLayer.click();

    // Assertion to check if layer set as irreplaceable or replaceable
    await page.getByText('change replaceable status').click();
    await expect(page.getByText(/New assets set as (irreplaceable|replaceable)/)).toBeVisible({ timeout: 10000 });

});


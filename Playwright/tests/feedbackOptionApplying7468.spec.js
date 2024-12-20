import { test, expect } from '@playwright/test';
import { login } from '../login';
require('dotenv').config();
import { faker } from '@faker-js/faker';

/*
BEGOERE RUNING THE TESTS
RUN node saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

//Use the saved authentication state
test.use({ storageState: 'auth.json' });

const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const randomWords = faker.lorem.words();

//Feedback Options Applying
test ('Feedback Options Applying', async ({ page }) => {
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

    //Click on the create template button
    await page.waitForSelector('#create-template');
    const startDesigning = page.locator('#create-template')
    await expect(startDesigning).toBeVisible({ timeout: 10000 });
    await startDesigning.click();

    //await page.waitForLoadState('networkidle');
    if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
        await page.waitForLoadState('networkidle');
    }
    const textButton = page.getByRole('button', { name: 'help Feedback', exact: true })

    await expect(textButton).toBeVisible({ timeout: 10000 });
    await textButton.click();

    // Assertions of Feedback Popup
    await expect(page.getByRole('heading', { name: 'Give us some Feedback!' })).toBeVisible();
    await expect(page.getByText('Suggest a feature')).toBeVisible();
    await expect(page.getByPlaceholder('How can we improve our app?')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('include a screenshot of your')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'send' })).toBeVisible(   );

    // Fill feedback without option chosen
    const feedback = await page.getByPlaceholder('How can we improve our app?');
    await feedback.click();
    await feedback.fill(randomWords);
    await page.getByRole('button', { name: 'send' }).click();
    await expect(page.getByText('Dropdown option is required')).toBeVisible({ timeout: 10000 });
    await page.getByPlaceholder('How can we improve our app?').clear();
    
    // Fill feedback with option chosen and no text
    //   !!!!!   Should be improved regarding to Feedback options on PROD
    await page.getByText('Suggest a feature').click();
    await page.getByText('General feedback', { exact: true }).click();
    await page.getByRole('button', { name: 'send' }).click();
    await expect(page.getByText('Is required. Max length is')).toBeVisible({ timeout: 10000 });

    // Fill feedback with option chosen on previouse test and text
    const feedback2 = await page.getByPlaceholder('How can we improve our app?');
    await feedback2.click();
    await feedback2.fill(randomWords);
    await page.getByRole('button', { name: 'send' }).click();

    await expect(page.getByRole('heading', { name: 'feedback has been sent!' })).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'ok', exact: true }).click();

    // await page.goto('/admin/upc/feedback/');
    // //await page.waitForLoadState('networkidle');
    // if (page.url().includes('https://ucl-coolab-dev.uk.r.appspot.com/')) {
    //     await page.waitForLoadState('networkidle');
    // }
    // await expect(page.locator('#result_list')).toContainText(randomWords);
});
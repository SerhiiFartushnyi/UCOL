import { test, expect } from '@playwright/test';
import config from './config';
import { faker } from '@faker-js/faker';

//BEGOERE RUNING THE TESTS
// RUN node tests/saveAuthState.js   to save the authentication state to a file named auth.json
// RUN npx playwright test tests/loginUcol.spec.js

// Use the saved authentication state

test.use({ storageState: 'auth.json' });

const mail = config.mail;
const password = config.password;
const randomWords = faker.lorem.words();

//Feedback Options Applying

test ('Feedback Options Applying', async ({ page }) => {
    test.slow();
    await page.goto('/');

    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByPlaceholder('enter your e-mail address').click();
    await page.getByPlaceholder('enter your e-mail address').fill(mail);
    await page.getByRole('button', { name: 'Log in' }).click();

    await page.getByPlaceholder('8 char. +1 symbol, number,').click();
    await page.getByPlaceholder('8 char. +1 symbol, number,').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();

    //Assertions to check if the user is logged in
    await page.waitForSelector('body');
    await expect(page.locator('body')).toContainText('Design professional');

    await page.waitForLoadState('networkidle');

    //Click on the create template button
    const startDesigning = page.locator('#create-template')
    await expect(startDesigning).toBeVisible();
    await startDesigning.click();

    await page.waitForLoadState('networkidle');
    const textButton = page.getByRole('button', { name: 'help Feedback', exact: true })

    await expect(textButton).toBeVisible();
    await textButton.click();

    // Assertions of Feedback Popup
    await expect(page.getByRole('heading', { name: 'Give us some Feedback!' })).toBeVisible();
    await expect(page.getByText('Suggest a feature')).toBeVisible();
    await expect(page.getByPlaceholder('How can we improve our app?')).toBeVisible();
    await expect(page.getByText('include a screenshot of your')).toBeVisible();
    await expect(page.getByRole('button', { name: 'send' })).toBeVisible();

    // Fill feedback without option chosen
    await page.getByPlaceholder('How can we improve our app?').click();
    await page.getByPlaceholder('How can we improve our app?').fill(randomWords);
    await page.getByRole('button', { name: 'send' }).click();
    await expect(page.getByText('Dropdown option is required')).toBeVisible();
    await page.getByPlaceholder('How can we improve our app?').clear();
    
    // Fill feedback with option chosen and no text
    //   !!!!!   Should be improved regarding to Feedback options on PROD
    await page.getByText('Suggest a feature').click();
    await page.getByText('bug', { exact: true }).click();
    await page.getByRole('button', { name: 'send' }).click();
    await expect(page.getByText('Is required. Max length is')).toBeVisible();

    // Fill feedback with option chosen on previouse test and text
    await page.getByPlaceholder('How can we improve our app?').click();
    await page.getByPlaceholder('How can we improve our app?').fill(randomWords);
    await page.getByRole('button', { name: 'send' }).click();

    await expect(page.getByRole('heading', { name: 'feedback has been sent!' })).toBeVisible();
    await page.getByRole('button', { name: 'ok', exact: true }).click();

    await page.goto('/admin/upc/feedback/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#result_list')).toContainText(randomWords);
});
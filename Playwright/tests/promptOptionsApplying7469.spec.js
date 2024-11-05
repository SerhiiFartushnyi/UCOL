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

//Prompt Options Applying

test('Prompt Options Applying', async ({ page }) => {
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
    const promptButton = page.getByRole('button', { name: 'help Prompt', exact: true })

    await expect(promptButton).toBeVisible();
    await promptButton.click();

    // Assertions of Prompt Popup
    await expect(page.getByText('what would you like to')).toBeVisible();
    await page.getByRole('button', { name: 'back', exact: true }).click();
    await expect(page.getByText('what would you like to')).not.toBeVisible();

    await promptButton.click();

    // Fill prompt without
    await page.getByPlaceholder('Design a {FORMAT} for a {SUBJECT}').click();
    await page.getByPlaceholder('Design a {FORMAT} for a {SUBJECT}').fill('Some Test Message');  // can be automated
    await page.getByRole('button', { name: 'use prompt to design' }).click();

    // Popup Assertions
    await expect(page.getByText('this will exit and create a')).toBeVisible();
    await page.getByRole('button', { name: 'stay here' }).click();
    await expect(page.getByText('this will exit and create a')).not.toBeVisible();

    await promptButton.click();

    // Fill prompt with random format and subject
    const formatIdeas = [
        'Poster', 'Logo', 'Infographic', 'Website', 'Mobile App Interface',
        'Business Card', 'Advertisement Banner', 'Packaging', 'Social Media Post', 'Magazine Cover'
    ];

    const subjectIdeas = [
        'Music Festival', 'Technology Startup', 'Wildlife Conservation', 'Space Exploration', 'Coffee Shop',
        'Fitness App', 'Sustainable Fashion', 'Online Education Platform', 'Art Exhibition', 'Charity Event'
    ];

    // Generate random indices
    const randomFormatIndex = Math.floor(Math.random() * formatIdeas.length);
    const randomSubjectIndex = Math.floor(Math.random() * subjectIdeas.length);

    // Get the random format and subject
    const randomFormat = formatIdeas[randomFormatIndex];
    const randomSubject = subjectIdeas[randomSubjectIndex];

    // Fill the placeholder with the selected format and subject
    await page.getByPlaceholder('Design a {FORMAT} for a {SUBJECT}').click();
    await page.getByPlaceholder('Design a {FORMAT} for a {SUBJECT}').fill(`Design a ${randomFormat} for a ${randomSubject}`);
    await page.getByRole('button', { name: 'use prompt to design' }).click();
    await page.getByRole('button', { name: 'ignore my current project' }).click();
    console.log(`Filled with: Design a ${randomFormat} for a ${randomSubject}`);

    // Check some genetrating flow & if  the URL contains '/tool/scene/'
    await expect(page.getByText('understanding the prompt')).toBeVisible();
    await expect(page.getByText('generating visuals')).toBeVisible();
  
    await page.waitForLoadState('networkidle');

    // Check if the URL contains '/tool/scene/'
    const currentUrl = page.url();
    expect(currentUrl).toContain('/tool/scene/');

    // here can be put Timout and checked final page name 
});


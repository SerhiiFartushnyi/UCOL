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

const email = process.env.EMAIL1;
const password = process.env.PASSWORD1;


test('Brand Room Functionallity',async ({ page }) => {

    await login(page, email, password);

    // Navigate to site  
    await page.goto('/');

    await page.locator('#features-dropdown-toggler div').filter({ hasText: 'features' }).click();
    await page.locator('#brand-room-link').click();

    // Check if we are on the Brand Room Page

    await expect(page.locator('#brand-room-tabs')).toContainText('Brand Room');
    await expect(page.getByText('Brand Room', {exact: true})).toBeVisible({timeout: 10000});
    expect(page.url()).toContain('/projects/#brand-room');
});


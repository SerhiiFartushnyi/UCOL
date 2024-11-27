import { test, expect } from '@playwright/test';

/*
BEFOERE RUNING THE TESTS
RUN node saveAuthState.js   to save the authentication state to a file named auth.json
RUN npx playwright test tests/loginUcol.spec.js
*/

// Use the saved authentication state
test.use({ storageState: 'auth.json' });

test('Login w Google flow', async ({ page }) => {
    // Mocking the Google login API response
    await page.route('**/auth/google', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          // Mocked user data
          token: 'mocked-token',
          user: {
            id: '123456',
            email: 'user@example.com',
            name: 'Mock User',
          },
        }),
      });
    });
  
    // Go to the app and simulate login flow
    await page.goto('/');
    await page.locator('#profile').getByRole('paragraph').getByText('log in').click();
    await page.getByRole('button', { name: 'continue with Google' }).click();
  
    // Check if the page behaves as if the user logged in
    const loggedInMessage = await page.getByText('Successfully signed in.');
    await expect(loggedInMessage).toHaveText('Successfully signed in.');
  
  });
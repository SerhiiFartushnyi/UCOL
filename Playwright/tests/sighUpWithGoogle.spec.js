import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth.json' });

test('Mock Google Sign Up Flow', async ({ page }) => {
  // Intercept the network request to the Google OAuth endpoint and mock the response
  await page.route('**/google-auth-endpoint', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'mock-google-oauth-token',
        user: {
          id: 'mock-google-user-id',
          email: 'mockuser@gmail.com',
          name: 'Mock User'
        }
      }),
    });
  });

  // Go to the app and simulate login flow
  await page.goto('/');
  await page.locator('#profile').getByRole('paragraph').getByText('sign up').click();
  await page.getByRole('button', { name: 'continue with Google' }).click();

  // Check if the page behaves as if the user logged in
  const loggedInMessage = await page.getByText('Successfully signed in.');
  await expect(loggedInMessage).toHaveText('Successfully signed in.');

});

import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth.json' });

test.skip('test', async ({ page }) => {
  await page.goto('https://ucl-coolab-dev.uk.r.appspot.com/');
  await page.getByText('sign up').click();
  await page.getByPlaceholder('enter your e-mail address').click();
  await page.getByPlaceholder('enter your e-mail address').fill('far2shok@gmail.com');
  await page.getByPlaceholder('8 char. +1 symbol, number,').click();
  await page.getByPlaceholder('8 char. +1 symbol, number,').fill('Qwert12345!');
  await page.getByPlaceholder('confirm your password').click();
  await page.getByPlaceholder('confirm your password').fill('Qwert12345!');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByPlaceholder('enter your first name').click();
  await page.getByPlaceholder('enter your first name').fill('Serhii');
  await page.getByPlaceholder('enter your last name').click();
  await page.getByPlaceholder('enter your last name').fill('Fartushnyi');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('#auth-modal-content')).toContainText('Get verified');


  await page.goto('https://mail.google.com/mail/u/0/#inbox'); 

});
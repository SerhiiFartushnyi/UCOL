import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('http://uitestingplayground.com/ajax');
    await page.getByText('Button Triggering AJAX Request').click();
});

test.only('autoWaiting', async ({ page }) => {
    
    const succesButton = page.locator('.bg-success')
    await succesButton.click();

    //const text = await succesButton.textContent();
    const text = await succesButton.allTextContents();

    expect(text).toBe('Data loaded with AJAX get request.');

});

test ('alternative waits', async ({ page }) => {
    const succesButton = page.locator('.bg-success')

    //___ Wait for the element
    await page.waitForSelector('.bg-success');

    //___ wait for particulr responce
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata');

    //___ wait for network calls to be compleated  NOT RECOMMENDED
    await page.waitForLoadState('networkidle');

    await page.waitForTimeout(5000);

    const text = await succesButton.alltextContent();
    expect(text).toBe('Data loaded with AJAX get request.');

});





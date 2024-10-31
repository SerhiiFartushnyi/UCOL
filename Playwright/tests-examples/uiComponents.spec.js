import {test, expect} from '@playwright/test';

test.beforeEach(async ({page}) => {
await page.gotp('http://localhost:4200')
})

test.describe('Form layouts page', () => {
    test.beforeEach(async ({page}) => {
        await page.getByText('Forms').click();
        await page.getByText('Forms Layouts').click();
    })

    test('input fields', async ({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"});
        
        await usingTheGridEmailInput.fill('test@test.com');
        await usingTheGridEmailInput.clear();
        await usingTheGridEmailInput.pressSequentially('test@test.com', {delay: 500});

        //generic assetrion
        const inputValue = await usingTheGridEmailInput.inputValue();
        expect(inputValue).toEqual('test2@test.com');

        // locator  assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com');

    })

    test('radio buttons', async ({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})

        await usingTheGridForm.getByLabel('Option 1').check({force: true});
        await usingTheGridform.getByRole('radio', {name: "Option 1"}).check({force: true});

        const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked();
        expect(radioStatus).toBeTruthy();

        expect(usingTheGridForm.getByRole('radio', {name: "Option 2"})).not.toBeChecked();
        expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked();

        await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true});
        expect(usingTheGridForm.getByRole('radio', {name: "Option 2"})).isChecked().toBeFalsy();
        expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).isChecked().toBeTruthy();

    })

    test('checkboxes', async ({page}) => {
        await page.getByText('Modals & Overlays').click();
        await page.getByText('Toastr').click();

        await page.getByRole('checkbox', {name: "Hide on click"}).check({force: true}); // uncheck()
        // if we use click() method, the checkbox will be checked but the value will not be changed
        // if we use check() method, the checkbox will be checked and the value will be changed

        await page.getByRole('checkbox', {name: "Prevent arising of ..."}).uncheck({force: true});
        expect(page.getByRole('checkbox', {name: "Hide on click"})).toBeChecked();

        const allBoxes = page.getByRole('checkbox');
        for (const box of await allBoxes.all()) {
            await box.check({force: true})
            expect(await box.isChecked()).toBeTruthy()
        }
    });













    //     await radioButtons.get(0).click();
    //     await expect(radioButtons.get(0)).toBeChecked();

    //     await radioButtons.get(1).click();
    //     await expect(radioButtons.get(1)).toBeChecked();

    //     await radioButtons.get(2).click();
    //     await expect(radioButtons.get(2)).toBeChecked();
    // })

})
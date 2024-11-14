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
        }
    );

    test('list and dropdowns', async ({page}) => {
        const dropDownMenu = page.locator('ngx-header nb select')
        await dropDownMenu.click();

        page.getByRole('list') //when list has a UL tag
        page.getByRole('listitem') //when list has a LI tag

        //const optionList = page.getByRole('list').locator('nb-option');
        
        const optionList = page.locator('nb-option-list nb-option');
        await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate']);

        await optionList.filter({hasText: 'Dark'}).click();

        // Check the background color of the header
        const header = page.locator('nb-layout-header');
        await expect(header).toHaveCSS('background-color', 'rgb(34, 43, 69)');

        const colors ={
            Light: 'rgb(255, 255, 255)',
            Dark: 'rgb(34, 43, 69)',
            Cosmic: 'rgb(50, 50, 89)',
            Corporate: 'rgb(255, 255, 255)',
        }

await dropDownMenu.click();
for(const color in colors){
    await optionList.filter({hasText: color}).click();
    await expect(header).toHaveCSS('background-color', colors[color]);
    await dropDownMenu.click();
    if(color != 'Corporate'){           // if (color === 'Corporate') { 
        await dropDownMenu.click();    //    break;
    }                                  //  }
}
await optionList.get(1).click(); // 
});

 // Do to Sources >> Use commbination (command+backslash) to freeze the browser
test ('tooltips', async ({page}) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Tooltip').click();

    const toolTipCard = page.locator('nb-card', {hasText: 'Tooltip Placement'});
    await toolTipCard.getByRole('button',{name: "Top"}).hover();

    page.getByRole('tooltip'); // if you have a role tooltip created

    const toolTip = page.locator('nb-tooltip').textContent();
    expect(toolTip).toEqual('This is a tooltip');
});


test ('dialog box', async ({page}) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    page.on('dialog', async dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?');
        dialog.accept();
    });

    await pagegetByRole('table').locator('tr', {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click();
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com');
});


test ('web tables', async ({page}) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();
    
    // 1 get the raw by any text in this raw
    const targetRaw = page.getByRole('raw', {name: "twitter@outlook.com"});
    await targetRaw.locator('nb-edit').click();

    await page.locator('input-edit').getByPlaceholder('Age').clear();
    await page.locator('input-edit').getByPlaceholder('Age').fill('39');
    await page.locator('.nb-checkmark').click();

    // 2 get the based on the value in the spacifc column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click();
    const targetRawById = page.getByRole('raw', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')});
    await targetRawById.click();
    await page.locator('input-edit').getByPlaceholder('E-mail').clear();
    await page.locator('input-edit').getByPlaceholder('E-mail').fill('test@test.com');
    await page.locator('.nb-checkmark').click();
    await expect(targetRawById.locator('td').nth(5)).toHaveText('test@test.com');

    // 3 test filter of the table
    const ages = ['20', '30', '40', '200']; 

    for( let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear
        await page.locator('input-filter').getByPlaceholder('Age').fill(age);
        await page.waitForTimeout(500);
        const ageRows = page.locator('table tr')

        for(let row of ageRows.all()){
            const cellValue = await row.locator('td').last().textContent();

            if (age === '200'){
                expect(await page.getByRole('table').textContent()).toContain('No data found');
            }
            else{
            expect(cellValue).toEqual(age);
            }
        }
    }
});

test('date picker', async ({page}) => {
    await page.getByText('Forms').click();
    await page.getByText('Datepicker').click();

    const calendarInputField = page.getByPlaceholder('Form Picker');
    await calendarInputField.click();

    let date = new Date();
    date.setDate(date.getDate() + 1);
    const expectedDate = date.getDate().toString();
    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'});
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'});
    const expectedYear = date.getFullYear().toString();
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

    // await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click();
    // await expect(calendarInputField).toHaveValue(dateToAssert);

    let calendarMonthAndYear = page.locator('nb-calendar-view-mode').textContent();
    const expactedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `;
    while(!calendarMonthAndYear.includes(expactedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data=name="chevron-right"]').click();
        calendarMonthAndYear = page.locator('nb-calendar-view-mode').textContent();
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click();
    await expect(calendarInputField).toHaveValue(dateToAssert);
});

test ('sliders', async ({page}) => {
    // Update Attribut
    const tempGuage = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger');
    await tempGuage.evaluate( node => {
        node.setAttribute('sx', '23.630');
        node.setAttribute('sy', '23.630');
    });
    await tempGuage.click();

    // Mouse Movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger');
    await tempBox.scrollIntoViewIfNeeded();

    const box = await tempBox.boundingBox();
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;

    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 100, y);
    await page.mouse.move(x + 100, y + 100);
    await page.mouse.up();
    await expect(tempBox).toContainText('30');

});

test('drag and drop with iframe', async ({page}) => {
    await page.goto('https://globalsqa.com/demo-site/drag-and-drop/');
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe');

    await frame.locator('li', {hasText: "High Tatras 2"}).dragTo(frame.locator('trash'));

    //more precise control 
    await frame.locator('li', {hasText: "High Tatras 4"}).hover();
    await page.mouse.down();
    await frame.locator('trash').hover();
    await page.mouse.up();

    await expect(frame.locator('#trash li h5').toHaveText(['High Tatras 2', 'High Tatras 4']));
});

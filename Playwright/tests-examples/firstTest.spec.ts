import {test, expect} from '@playwright/test'


test.beforeEach(async({page}) => {
  await page.goto('http://localhost:4200')
  await page.getByText('Forms').click()
  await page.getByText('Form Layouts').click()
})

test('Locator suntax rules',async ({page}) => {
    //By Tag name
    await page.locator('input').first().click()

    //By ID
    page.locator('#inputEmail1')

    //by Class value
    page.locator('.shape-rectangle')

    //by atribute
    page.locator('[placeholder="Email"]')

    //by Class value (Full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //combine different selectors
    page.locator('input[placeholder="Email][nbinput]')

    //by XPath (NOT RECONMMENDED)
    page.locator('//*[@id=inputEmail1')

    //by partial text match
    page.locator(':text("Using")')

    //by exact text match
    page.locator(':text-is("Using the Grid")')
})

test('User facing locators', async({page}) =>{
    await page.getByRole('textbox',{name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the Grid').click()

    await page.getByTitle('Iot Dashboard').click()

    //await page.getByTestId('SignIn').click() !!! in code >> data-testid="SignIn"
})


test('locating child elements ', async({page}) =>{

    await page.locator('nb-card nb-radio :text-is("Option 1")').click()

    await page.locator('nb-card').locator('nb-radio').locator(':text("Option 2")').click()

    await page.locator('nb-card').getByRole('button', {name: "Sign IN"}).first().click() //combination of locators 

    await page.locator('nb-card').nth(3).getByRole('button').click() //less preferable 

})

test('locating parents elements ', async({page}) =>{

    await page.locator('nb-card', {hasText:"Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click() // by Id


    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign In"})
    .getByRole('textbox', {name: "Password"}).click()

    await page.locator(':text_is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click() //one level up

})

test('reusing the locators', async({page}) => {

    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')
})

test.only('extracting values', async({page}) => {
    //single test value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    //all text values
    const allRadioButtinsLables = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtinsLables).toContain("Option 1")

    //input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com1')

    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual("Email")
})

test.only('assertions', async({page}) => {

    // Generat assertions
    const value = 5
    expect(value).toEqual(5)

    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')
    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    // Locator assertion
    await expect(basicFormButton).toHaveText('Submit')

    //Soft Assertion
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click()

})

test('assertions with timeout', async({page}) => {
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')
    await expect(basicFormButton).toHaveText('Submit', {timeout: 5000})
})

/**
test.describe('suite 1', () => {
  test.beforeEach(async({page})=> {
    await page.getByText('Charts').click()
  })

test('the first test', async ({page})=>{
  await page.getByText('Form Layouts').click()
})

test('navigate to date picker rage', async ({page})=>{
  await page.getByText('Datepicker').click()
})
})

test.describe('suite 2', () => {
  test.beforeEach(async({page})=> {
    await page.getByText('Forms').click()
  })

test('the first test2', async ({page})=>{
  await page.getByText('Form Layouts').click()
})

test('navigate to date picker rage 2', async ({page})=>{
  await page.getByText('Datepicker').click()
})
})
**/
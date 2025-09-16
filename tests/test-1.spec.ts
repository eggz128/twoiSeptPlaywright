import { test, expect } from '@playwright/test';

//The callback function can request a Playwright "Fixture" - { page } in this case
test('test', async ({ page }) => { //PW will set up a browser with a context for this test, and set up a page in that ready for us to use 
  // Recording...
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  await page.getByRole('link', { name: 'Login To Restricted Area' }).click();
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');
  await page.locator('#password').click();
  await page.locator('#password').fill('edgewords123');
  await page.getByRole('link', { name: 'Submit' }).click();
  //No need for a wait - the assertion will retry if it doesnt find the element , or it has the "wrong" text
  await expect(page.locator('h1')).toContainText('Add A Record To the Database');

});

test('test2', async ({ page }) => { //PW can reuse the browser if open. It will establish a new context and page for each test to use
  
  //No waits required. PW will auto wait for animations, scrolling and elements if required.

  //...except we do need to "await" steps.
  //all these steps send instructions to the browser that will be completed at some "future" point in time
  //without "await" - all code potentially "executes" before any actual actions/effects have taken place
  //The test may "complete" before the browser has had a chance to actually "do" anything

  //With "await" execution is paused until the browser says the step has completed.

  //In technical terms, each PW API call immediately returns a "promise" of a future action
  //await(ing) waits for the promise to finally "resolve" before continuing

  //No need to await locators in PW (as unlike WebDriver) - no search for element is performed here
  const searchBox = page.getByRole('searchbox', { name: 'Search for:' });
  
  await page.goto('demo-site/');
  
  await searchBox.click(); //When PW interacts with an element - it will do the necessary search at this time
  await searchBox.fill('cap'); //This is when it's importnant to await
  await searchBox.press('Enter');

  //await page.getByRole('button', { name: /Add to .*/ }).click();
  //await page.getByRole('button', { name: "Add to" }).click(); //name: does a sub string match
  //await page.getByRole('button', { name: "ADD TO" }).click(); //also it's case insensitive
  await page.getByRole('button', { name: "ADD TO", exact: true }).click(); //Exact (inc case) match
  await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
  await page.getByRole('link', { name: 'Remove this item' }).click();
  await page.getByRole('link', { name: 'Return to shop' }).click();
  await page.locator('#menu-item-42').getByRole('link', { name: 'Home' }).click();

});

//Be careful with "Record at cursor" - you must be in a test() methods callback function when recording
//If you record out here you will break the file (preventing it from compiling & runnning)

  // await page.getByRole('link', { name: 'Remove this item' }).click();
  // await page.getByRole('link', { name: 'Return to shop' }).click();

test('all products', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/demo-site/');
  const newProducts = page.getByLabel('Recent Products');
  for (const prod of await newProducts.locator('h2:not(.section-title)').all()) { //gathers a collection of all() matching elements
    console.log(await prod.textContent()); //then loops over each individual match logging the text
  }; //No need to await console, but you do need to await the locator. Or you will only get the "promise" of the text, not the actual text.
  
});

test('Locator Handler', async ({ page }) => {
  // Setup the handler.
  const cookieConsent = page.getByRole('heading', { name: 'Hej! You are in control of your cookies.' });
  await page.addLocatorHandler(
    cookieConsent, //Locator to watch out for
    async () => { //If spotted, what to do
      await page.getByRole('button', { name: 'Accept all' }).click();
    }
    , //Optional arguments - can be omitted
    {
      times: 10, //How many times the locator may appear before the handler should stop handling the locator
      //By default Playwright will wait for the locator to no longer be visible before continuing with the test.
      noWaitAfter: true //this can be overridden however
    }
  );

  // Now write the test as usual. If at any time the cookie consent form is shown it will be accepted.
  await page.goto('https://www.ikea.com/');
  await page.getByRole('link', { name: "Let's go to Denmark!" }).click();
  await expect(page.getByRole('heading', { name: "Let's go to Denmark!"})).toBeVisible();

  //If you're confident the locator will no longer be found you can de-register the handler
  //await page.removeLocatorHandler(cookieConsent);
  //If the cookie consent form appears from here on it may cause issues with the test...
  await page.waitForTimeout(5000);
})
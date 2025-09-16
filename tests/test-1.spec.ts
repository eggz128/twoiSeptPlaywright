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
  await page.goto('demo-site/');
  await page.getByRole('searchbox', { name: 'Search for:' }).click();
  await page.getByRole('searchbox', { name: 'Search for:' }).fill('cap');
  await page.getByRole('searchbox', { name: 'Search for:' }).press('Enter');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
  await page.getByRole('link', { name: 'Remove this item' }).click();
  await page.getByRole('link', { name: 'Return to shop' }).click();
  await page.locator('#menu-item-42').getByRole('link', { name: 'Home' }).click();

});


//Be careful with "Record at cursor" - you must be in a test() methods callback function when recording
//If you record out here you will break the file (preventing it from compiling & runnning)

  // await page.getByRole('link', { name: 'Remove this item' }).click();
  // await page.getByRole('link', { name: 'Return to shop' }).click();
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

test('actions', async({page})=>{
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/index.html');
  await page.getByRole('link', { name: 'Forms' }).click();
  await page.locator('#textInput').click();
  await page.locator('#textInput').fill('Steve Powell');
  await page.locator('#textInput').fill('Stephen Powell'); //Fill auto clears the text box before entry (no append)
  //await page.locator('#textInput').clear(); //Manually clears the text box "by magic". 99.999% of the time that's fine.
  await page.locator('#textInput').press('Control+KeyA'); //However you could use keyboard shortcuts to clear exactly like a user might
  await page.locator('#textInput').press('Backspace'); 
  await page.locator('#textInput').pressSequentially(' should append', {delay: 200}); //wont clear, just append, and will do so with slow keypresses
  await page.locator('#textArea').click();
  await page.locator('#textArea').fill('was\nhere\n'); //Multiline text entry - \n = new line
  await page.locator('#checkbox').check(); //Ensure checkbox is on
  await page.locator('#checkbox').click(); //Toggle off
  await page.locator('#checkbox').click(); //Toggle on
  await page.locator('#checkbox').uncheck(); //Force off
  await page.locator('#select').selectOption('Selection Two');
  await page.locator('#two').check(); //Also works for radio buttons
  await expect.soft(page.locator('input[type=radio]')).toHaveCount(2); //Soft asserts fail the test but allow code execution to continue within the test
  await expect(page.locator('input[type=radio]')).toHaveCount(3); //A (non soft) failed assertion will stop and fail the test here. The following line would not execute.
  await page.getByRole('link', { name: 'Submit' }).click();
});

test('drag drop slider', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/cssXPath.html')

  await page.locator('#apple').scrollIntoViewIfNeeded();
  //Dragging 'outside' of an element normally fails due to 'actionability' checks. force:true tells Playwright just to do the action skipping any checks.
  //await page.dragAndDrop('#slider a', '#slider a', {targetPosition: {x: 100, y:0}, force: true}) //While this moves the gripper it wont change the size of the apple - this is due to the JS on the page that does the resizing not firing properly for large movements
  //await page.click('css=#slider a') //Old way of clicking things - stilll works but prefer page-findelement-click
  await page.locator('#slider a').click();
  //So instead do lots of little jumps. Just make sure that you 'jump' far enough to get 'outside' the gripper each time
  await page.dragAndDrop('#slider a', '#slider a', { targetPosition: { x: 20, y: 0 }, force: true })
  await page.dragAndDrop('#slider a', '#slider a', { targetPosition: { x: 20, y: 0 }, force: true })
  await page.dragAndDrop('#slider a', '#slider a', { targetPosition: { x: 20, y: 0 }, force: true })
  await page.dragAndDrop('#slider a', '#slider a', { targetPosition: { x: 20, y: 0 }, force: true })
  //We should probably write a custom function for this 'lots of little jumps' drag and drop... e.g. 
  //await smoothDrag(page, '#slider a', 200, 5); //ToDo: write this function. 200 is the distance to move, 5 is the number of "jumps"

})
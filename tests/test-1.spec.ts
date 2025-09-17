import { test, expect } from '@playwright/test';

//The callback function can request a Playwright "Fixture" - { page } in this case
test('test @RunMe', async ({ page }) => { //PW will set up a browser with a context for this test, and set up a page in that ready for us to use 
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

test('test2', {tag: ['@RunMe', '@Smoke']}, async ({ page }) => { //PW can reuse the browser if open. It will establish a new context and page for each test to use
  
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
  //a comment
  //another comment
  
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
  const slowExpect = await expect.configure({timeout: 10000});
  await slowExpect.soft(page.locator('input[type=radio]')).toHaveCount(2); //Soft asserts fail the test but allow code execution to continue within the test
  await slowExpect(page.locator('input[type=radio]')).toHaveCount(2); //A (non soft) failed assertion will stop and fail the test here. The following line would not execute.
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


test('assertions', async ({ page }) => {
  test.setTimeout(0); //Gives test infinite time to execute (excluding expects/assertions). Needed to debug tests in PW v1.55
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  await page.getByRole('link', { name: 'Access Basic Examples Area' }).click();
  await page.getByRole('link', { name: 'Forms' }).click();

  await expect(page.getByRole('heading', { name: 'Forms' })).toBeVisible();

  // const slowExpect = expect.configure({timeout: 7000})

  // await slowExpect.soft(page.getByRole('paragraph')).toContainText('This form has aN');
  // await slowExpect.soft(page.locator('#textInput')).toHaveValue('Steve Powell');
  //
  // //ARIA Snapshots let you verify the accessibility tree hasn't changed (because the site has been refactored)
  // //They say *nothing* of if it's a *good* and useful accessibility tree
  //
  // //The accessibility tree is essentially what screenreaders and other assistance tools use 
  // await expect(page.locator('#right-column')).toMatchAriaSnapshot(`
  //   - heading "Forms" [level=1]
  //   - paragraph: This form has an id of theForm.
  //   - table:
  //     - rowgroup:
  //       - row "Text Input with id/name textInput * Steve Powell":
  //         - cell "Text Input with id/name textInput *"
  //         - cell "Steve Powell":
  //           - textbox: Steve Powell
  //       - row "Text Area with id/name textArea":
  //         - cell "Text Area with id/name textArea"
  //         - cell:
  //           - textbox
  //       - row "Checkbox with id/name checkbox":
  //         - cell "Checkbox with id/name checkbox"
  //         - cell:
  //           - checkbox
  //       - row "Select with id/name select Selection One":
  //         - cell "Select with id/name select"
  //         - cell "Selection One":
  //           - combobox:
  //             - option "Selection One" [selected]
  //             - option "Selection Two"
  //             - option "Selection Three"
  //       - row "Radio buttons with id/name radio One Two Three":
  //         - cell "Radio buttons with id/name radio"
  //         - cell "One Two Three":
  //           - radio [checked]
  //           - radio
  //           - radio
  //       - row "Password input with id/name password":
  //         - cell "Password input with id/name password"
  //         - cell:
  //           - textbox
  //       - row "File selector with id/name file":
  //         - cell "File selector with id/name file"
  //         - cell:
  //           - textbox
  //       - row "Submit Clear":
  //         - cell
  //         - cell "Submit Clear":
  //           - link "Submit"
  //           - link "Clear"
  //       - row "* Mandatory field.":
  //         - cell "* Mandatory field."
  //   `);

  await expect(page).toHaveTitle("Forms");
  await expect(page.getByRole('heading', { name: 'Forms' })).toBeVisible();
  await expect(page.getByRole('paragraph')).toContainText(/This form has an id Of .*/i); //Substring matches - can also use RegEx
  //await expect(page.getByRole('paragraph')).toHaveText('This form has an id of ');//exact match needed
  await expect(page.locator('#textInput')).toBeEmpty();

  await page.locator('#textInput').fill('Steve Powell');

  //Will fail on first run, but will generate the "golden" sample/reference image for future runs
  await expect(page.locator('#textInput')).toHaveScreenshot('textbox.png', { //The "golden sample" in github is a Firefox image that has been renamed and cropped to the same size as chromium produces - it should fail when the test runs with chromium
    threshold: 0.1, //Allowable colour variance 0-1
    maxDiffPixelRatio: 0.1, //Allowable different pixels 0-1
    //maxDiffPixels : 100 //Exact number of pixel allowed to differ
  }) //Will still fail regardless if the image sizes don't match

  //await expect(page.locator('#textInput')).toHaveText('Steve Powell'); //NO. <input> can't have a closing tag, therefore no inner text
  await expect(page.locator('#textInput')).toHaveValue('Steve Powell');

  //toHaveText() can be used with an array against an array of elements
  //await expect(page.locator('a.orange-button:visible'))//There's a 'hidden' orange 'button' - :visible is a PW CSS psuedo class extension
  await expect(page.locator('a.orange-button').filter({ visible: true })) //Alternative to :visible - use filter()
    .toHaveText(['Submit', 'Clear']);


  

  //Use Promise to evalute assertions in parallel/concurrently 
  // const results1 = await Promise.all([
  //   expect.soft(page.locator('#one')).toHaveValue('OneX'), //Note no await. We'll let Promise.All() wait for the promises to settle
  //   expect.soft(page.locator('#two')).toHaveValue('Two'), //If you use await the expects will be evaluated in sequence
  //   expect.soft(page.locator('#three')).toHaveValue('ThreeX',{timeout: 7000}) //soft expects are used so the first promise rejection (assertion failiure) doesnt immediately fail the test. **BUT** there is a race - if one assertion/promise has a longer timeout it wont be reported on as Promise.all() resolves as soon as the first rejecction takes place.
  // ])
  // console.log("results1", results1) //array of 3 undefined?? https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

  // //Promise.all() and soft assserts do fail the test (as expected) and/but allow execution to continue... maybe not what is wanted

  // const results2 = await Promise.all([ //returns as soon as one promise is rejected, so last fail not reported. Beware races.
  //   expect(page.locator('#one')).toHaveValue('OneX'), //Note no await. We'll let Promise.All() wait for the promises to settle
  //   expect(page.locator('#two')).toHaveValue('Two'), //If you use await the expects will be evaluated in sequence
  //   expect(page.locator('#three')).toHaveValue('ThreeX',{timeout: 7000})
  // ]) //no soft assert so will stop here
  //.catch((err) => console.error(err)) //unless error is caught. Error contains details of the *first* rejected promise
  //console.log("results2", results2)




  //This looks the most promising

  // //allSettled() will wait for the assertions to settle, and
  // const results = await Promise.allSettled([ //returns array of objects with "status" and "reason" properties
  //   expect(page.locator('#one')).toHaveValue('OneX'), 
  //   expect(page.locator('#two')).toHaveValue('Two'), 
  //   expect(page.locator('#three')).toHaveValue('ThreeX', {timeout: 7000}) 
  // ])
  // //However the test actually passes (unlike all() + soft asserts) and execution continues...
  // //I guess it's up to us to decide to stop if any of the object statuses are "rejected"
  // if (results.some((result) => result.status === 'rejected')) {
  //   for (const result of results) {
  //     if (result.status === 'rejected') {
  //       console.error(`Assertion failed: ${result.reason}`);
  //     }
  //   }
  //   throw new Error(`Some assertions failed`); //Not ideal reporting, but failiure messages are at least now in the reports stderr attachment 
  // }

  // console.log("Fin") //Didn't get here - good!

  // const results = await Promise.allSettled([ //returns array of objects with "status" and "reason" properties
  //   expect(page.locator('#one')).toHaveValue('OneX'), 
  //   expect(page.locator('#two')).toHaveValue('Two'), 
  //   expect(page.locator('#three')).toHaveValue('ThreeX', {timeout: 7000}) 
  // ]).catch(err => console.log("caught: ", err)) //no err thrown despite rejected promise
  // .then(results => console.log("then: ", results)) //we get the array of objects with the outcome of each promise
  // .finally(() => console.log("finally"));

  //Looks like Promise.allSettled() is the way to go - then examine the returned object and decide to stop or not (i.e. soft assert)
});
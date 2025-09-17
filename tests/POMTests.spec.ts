import { test, expect } from '@playwright/test';
import { HomePOM } from './POMClasses/HomePagePOM';
import { AuthPOM } from './POMClasses/AuthPagePOM';
import { AddRecordPOM } from './POMClasses/AddRecordPOM';


test('Traditional Test', async ({ page }) => {
  //Arrange
  await page.goto('http://www.edgewordstraining.co.uk/webdriver2/');
  await page.getByRole('link', { name: 'Login To Restricted Area' }).click();
  //Act
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');
  await page.locator('#password').click();
  await page.locator('#password').fill('edgewords123');
  await page.getByRole('link', { name: 'Submit' }).click();
  //Assert
  await expect(page.locator('h1')).toContainText('Add A Record To the Database');
});

test('POM Test', async ({ page }) => {
  test.setTimeout(0); //PW 1.55 debugging bug
  await page.goto('http://www.edgewordstraining.co.uk/webdriver2/');
  const home = new HomePOM(page);
  await home.goLogin();
  const auth = new AuthPOM(page);
  await auth.login('edgewords', 'edgewords123');
  const addRecord = new AddRecordPOM(page);
  
  //Should retry using locator - is "leaking" locators back to the test "bad"? 
  await expect.soft(addRecord.heading).toHaveText('Add A Record To the DatabaseX'); 

  //Problem: This won't retry
  // expect(await addRecord.getHeading()) //Result is captured once, then compared once.
  //       .toEqual('Add A Record To the DatabaseX');

  //If a getter is used to retrieve a value from a page, to make it retry use expect.poll
  expect.poll(async () => {
    const heading = await addRecord.getHeading();
    return heading; //When run in debug you will see it captures "Access and authentication" - the old page - initially
  }, { //Optional config object
    message: "Wrong heading", //Optional message
    timeout: 10000, //Optional timeout (overrides default expect timeout)
    intervals: [500, 1000, 2000, 4000] //Custom polling schedule. Default is [100, 250, 500, 1000]
  }
  ).toEqual('Add A Record To the DatabaseX');

  //To get a soft assertion version:
  const softExpect = expect.configure({ soft: true })
  softExpect.poll(async () => {
    const heading = await addRecord.getHeading();
    return heading; //When run in debug you will see it captures "Access and authentication" - the old page - initially
  }, { //Optional config object
    message: "Wrong heading", //Optional message
    timeout: 10000, //Optional timeout (overrides default expect timeout)
    intervals: [500, 1000, 2000, 4000] //Custom polling schedule. Default is [100, 250, 500, 1000]
  }
  ).toEqual('Add A Record To the DatabaseX');

})
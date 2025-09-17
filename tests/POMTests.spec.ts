import { test, expect } from '@playwright/test';
import { HomePOM } from './POMClasses/HomePagePOM';
import { AuthPOM } from './POMClasses/AuthPagePOM';


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

test('POM Test', async({page})=>{
  await page.goto('http://www.edgewordstraining.co.uk/webdriver2/');
  const home = new HomePOM(page);
  await home.goLogin();
  const auth = new AuthPOM(page);
  await auth.login('edgewords','edgewords123');

})
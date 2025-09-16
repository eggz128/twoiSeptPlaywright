import { test, expect } from '@playwright/test';

//Test method takes 2 args
//1st arg = test name
//2nd arg = call back function containing the test code
test("My First Test", async ({page})=>{
    //driver.get("https://www.edgewordstraining.co.uk/webdriver2")
    await page.goto("https://www.edgewordstraining.co.uk/webdriver2");
    //driver.findElement(By.cssSelector("#menu > ul:nth-child(1) > li:nth-child(1) > a:nth-child(1)")).click()
    await page.locator("#menu > ul:nth-child(1) > li:nth-child(1) > a:nth-child(1)").click();
    
    //WebDriver can interact with locators that match more than one thing. Playwright cannot - it needs the locator to uniquely match just one element
    //await page.locator("#username").fill("edgewords") //Errors with: "Strict mode violation"

    //There are *two* elements with an id of "username" - the page uses invalid markup

    //To fix this we can filter down the 2 matches - in this case selecting the first (0th) match
    await page.locator("#username").nth(0).fill("edgewords") //Will also .clear()
    //await page.locator("#username >> nth=1").fill("edgewords") //Alternatively using PW CSS extension - note this is now a 1 based index
    //await page.locator("#username").filter({visible: true}).fill("edgewords"); //Using filter()
})


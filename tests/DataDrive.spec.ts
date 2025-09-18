import { expect } from '@playwright/test';
import { test } from './my-test'
import { HomePOM } from './POMClasses/HomePagePOM';
import { AuthPOM } from './POMClasses/AuthPagePOM';
import { AddRecordPOM } from './POMClasses/AddRecordPOM';
import credentials from './test-data/logins.json'

test('Env Vars', async ({ page }) => {
    test.setTimeout(0); //PW 1.55 debugging bug
    await page.goto('http://www.edgewordstraining.co.uk/webdriver2/');
    const home = new HomePOM(page);
    await home.goLogin();
    const auth = new AuthPOM(page);
    await auth.login(process.env.USER_NAME ?? "",
        process.env.PASS_WORD ?? ""); //Null coalesing operator ?? used to stop TS compiler complaining that env vars could be undefined
    const addRecord = new AddRecordPOM(page);

    //Should retry using locator - is "leaking" locators back to the test "bad"? 
    await expect.soft(addRecord.heading).toHaveText('Add A Record To the DatabaseX');
})


for (let data of credentials) {
    test(`Data driven using username ${data.username}`, async ({ page }) => {
        test.setTimeout(0); //PW 1.55 debugging bug
        await page.goto('http://www.edgewordstraining.co.uk/webdriver2/');
        const home = new HomePOM(page);
        await home.goLogin();
        const auth = new AuthPOM(page);
        await auth.login(data.username,
            data.password); //Null coalesing operator ?? used to stop TS compiler complaining that env vars could be undefined
        const addRecord = new AddRecordPOM(page);

        //Should retry using locator - is "leaking" locators back to the test "bad"? 
        await expect.soft(addRecord.heading).toHaveText('Add A Record To the DatabaseX');
    })
}


test('Project Parameters', async ({ page, person }) => {
    test.setTimeout(0); //PW 1.55 debugging bug
    await page.goto('http://www.edgewordstraining.co.uk/webdriver2/');
    const home = new HomePOM(page);
    await home.goLogin();
    const auth = new AuthPOM(page);
    await auth.login(person,
        process.env.PASS_WORD ?? ""); //Null coalesing operator ?? used to stop TS compiler complaining that env vars could be undefined
    const addRecord = new AddRecordPOM(page);

    //Should retry using locator - is "leaking" locators back to the test "bad"? 
    await expect.soft(addRecord.heading).toHaveText('Add A Record To the DatabaseX');
})
import { test, expect } from '@playwright/test';

test("Capturing values", async ({ page }) => {
    test.setTimeout(0); //Workaround PW v1.55 debugging issue
    await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html");
    await page.locator('#textInput').fill("Hello World");

    let textPromise = page.locator('#right-column').textContent();
    console.log("Without 'await'ing textContent() you get a 'promise' of the future text, not the actual text");
    console.log(await textPromise);

    let rightColText = await page.locator('#right-column').textContent(); //Includes whitespace in HTML file

    console.log("The right column text is with textContent is: " + rightColText);

    rightColText = await page.locator('#right-column').innerText(); //Captures text after browser layout has happened (eliminating most whitespace)

    console.log("The right column text is with innertext is: " + rightColText);

    let textBoxText: string = await page.locator('#textInput').textContent() ?? ""; //TS: if textContent() returns null, retuen empty string "" instead
    console.log("The text box contains" + textBoxText); //blank as <input> has no inner text

    //Using generic $eval to get the browser to return the INPUT text
    //This will *not* retry or wait
    textBoxText = await page.$eval('#textInput', (el: HTMLInputElement) => el.value); //el is an in browser HTML element - not a Playwright object at all.
    console.log("The text box actually contains: " + textBoxText);

    await page.$eval('#textInput', elm => {
        console.log(typeof(elm)) //Writes to browser's console! Not NodeJS console.
    });

    expect(textBoxText).toBe("Hello World");
});

test("Generic methods", async ({ page }) => {
    test.setTimeout(0); //Workaround PW v1.55 debugging issue
    await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html")

    const menuLinks = await page.$$eval('#menu a', (links) => links.map((link) => link.textContent))
    console.log(`There are ${menuLinks.length} links`)

    console.log("The link texts are:")

    for (const iterator of menuLinks) {
        console.log(iterator?.trim())
    }

    //Preferred - using retry-able Playwright locators
    const preferredLinks = await page.locator('#menu a').all();
    for (const elm of preferredLinks) {
        // const elmtext = await elm.textContent();
        // const elmtexttrimmed = elmtext?.trim();
        console.log(`${await elm.textContent().then(text => { return text?.trim() })}`)
    }
})


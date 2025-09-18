import { test, expect } from '@playwright/test'

test('Screenshots and reporting', {
    tag: ['@smoke', '@regression'],
    annotation: [
        { type: "Custom annotation 1", description: "This is a custom annotation" }, //Could be useful to include links to specific issues this test covers
        { type: "Custom annotation 2", description: "This is another custom annotation" }
    ]
},
    async ({ page, browserName }, testInfo) => { //testInfo givers access to the report, and other test information
        test.setTimeout(0); //PW 1.55 debug fix

        await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/basicHtml.html');
        const screenshot = await page.screenshot(); //Capture screenshot bitmap in variable. Note there is not an easy way to assert on this currently. See workaround test.
        await page.screenshot({ path: './manualscreenshots/screenshot-viewport.png' });
        await page.screenshot({ path: './manualscreenshots/screenshot-fullpage.png', fullPage: true });

        const htmlTable = page.locator('#htmlTable');
        await htmlTable.screenshot({ path: './manualscreenshots/screenshot-table.png' }); //Just the table, not the whole page

        await page.locator('#htmlTable').screenshot({
            path: './manualscreenshots/highlight-htmltable.png',
            mask: [page.locator('#TableVal2')], //Redact or highlight this element
            maskColor: 'rgba(214, 21, 179,0.5)', //default mask colour is magenta #ff00ff
            style: `#htmlTable tr:nth-child(3) {border: 10px solid red}
            table#htmlTable {border-collapse: collapse}
    ` //HTML table rows cannot have a border unless the table's border collapse model is set to collapse
        })

        if (browserName === "chromium") { //PDF generation only works on Chromium browsers, and can be headless/headed (error is misleading)
            await page.pdf({ path: './manualscreenshots/printed.pdf' })
        }


        console.log("Appears in std out section of the report") //In report at bottom, displayed in terminal at run time
        //Attaching arbitary data to the report.
        await testInfo.attach('Write some arbitary text to the report', { body: 'Hello World', contentType: 'text/plain' });
        await testInfo.attach('Masked Screenshot', { path: './manualscreenshots/highlight-htmltable.png', contentType: 'image/png' });
        await testInfo.attach('Screenshot from variable', { body: screenshot, contentType: 'image/png' });
    });


test("compare runtime images", { tag: ['@ignore', '@smoke'] }, async ({ page, browserName }, testInfo) => {
    test.setTimeout(0); //PW 1.55 debugging fix
    await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html");

    await page.locator('#textInput').fill("Hello World"); //Set intial state

    //ToDo: capture screenshot of text box in memory
    //Capture in mem is easy - doing the expect on it after, not so much as PlayWright expect .toMatchSnapshot() expects the screenshot to be on disk
    //See https://github.com/microsoft/playwright/issues/18937

    //const originalimage = await page.locator('#textInput').screenshot();
    //originalimage is now a buffer object with the screenshot. You could use a 3rd party js lib to do the comparison... but if we're sticking to Playwright only...

    //await expect(page.locator('#textInput')).toHaveScreenshot('textbox')
    //No good as PW wants to capture the screenshot on the first run and use that screenshot for following runs. We want to capture and use on this run. So...

    await page.locator('#textInput').screenshot({ path: `${testInfo.snapshotDir}/textbox2-${browserName}-${testInfo.snapshotSuffix}.png` })
    //screenshots will need to vary by browser and OS, and be saved in to the test snapshot directory for .toMatchSnapshot() to find them


    //Change element text
    await page.locator('#textInput').fill("Hello world"); //Alter the state (right now this is the same as initially set so following expect *should* pass)
    //change to e.g. "Hello world"

    //Recapture screenshot, compare to previous (on disk) version.
    expect(await page.locator('#textInput').screenshot()).toMatchSnapshot('textbox2.png')

    //Now go look at the html report
});
import {Page, Locator} from '@playwright/test'

export class AddRecordPOM {

    //Fields
    page: Page
    //Locators
    heading: Locator

    constructor(page: Page){
        this.page = page;
        this.heading = page.locator('h1')
    }

    //Service methods
    async getHeading(): Promise<string> {return this.heading.innerText()};
}
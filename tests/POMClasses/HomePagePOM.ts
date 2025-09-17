import {Page, Locator} from '@playwright/test'

export class HomePOM {

    //Fields
    page: Page
    //Locators
    loginLink: Locator

    constructor(page: Page){
        this.page = page;
        this.loginLink = page.getByRole('link', {name: "Login to restricted area"})
    }

    //Service methods
    async goLogin(){await this.loginLink.click()};
}

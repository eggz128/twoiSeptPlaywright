import { Page, Locator } from '@playwright/test'

export class AuthPOM {

    page: Page
    //Locator fields
    usernameField: Locator
    passwordField: Locator
    submitBtn: Locator

    constructor(page: Page) {
        this.page = page;
        this.usernameField = page.locator('#username:visible');
        this.passwordField = page.locator('#password');
        this.submitBtn = page.getByRole('link', {name: 'Submit'});
    }

    //Service Methods
    async login(username: string, password: string){
        await this.usernameField.press('Control+A')
        await this.usernameField.press('Enter')
        await this.usernameField.pressSequentially(username, {delay: 500});
        await this.passwordField.fill(password);
        await this.submitBtn.click();
    }
}
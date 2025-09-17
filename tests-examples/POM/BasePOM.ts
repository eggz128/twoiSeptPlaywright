import {Page, Locator} from '@playwright/test'


export class BasePOM {

    //Fields
    page: Page
    //Components

    //Locators
    demoStoreDismiss: Locator;
    searchBox: Locator;

    constructor(page: Page){
        this.page = page;
        
        this.demoStoreDismiss = page.getByRole('link', { name: 'Dismiss' });
        this.searchBox = page.getByRole('searchbox', { name: 'Search for:' });
    }
    //Low level helpers common to each page
    async getTitle(): Promise<string>{return await this.page.title()}
    async getScreenShot(): Promise<Buffer>{return await this.page.screenshot()}

    //Service methods
    async dismissDemoBanner(){await this.demoStoreDismiss.click()};
    async searchProduct(product: string){
        await this.searchBox.fill(product);
    }


}
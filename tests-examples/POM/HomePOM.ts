import { Page, Locator, expect } from '@playwright/test'
import { NavComponentPOM } from './NavComponentPOM';
import { BasePOM } from './BasePOM';


export enum Categories { //JS has no Enums. This is Typescript only
    Accessories,
    Hoodies,
    Tshirts
}

export class HomePOM extends BasePOM { //HomePOM IS-A BasePOM

    //Fields
    //page: Page //Get this from the base class

    //Components - Things this page (but not all other pages) has
    nav: NavComponentPOM

    //Locators - unique to Home Page
    shopByCategory: Locator

    constructor(page: Page) {
        super(page) //super must be called before 'this' is used

        //The Page HAS-A navbar
        this.nav = new NavComponentPOM(page);

        this.shopByCategory = page.getByLabel('Product Categories');
    }

    async navigate(){await this.page.goto('https://www.edgewordstraining.co.uk/demo-site')};

    //Service methods
    async shopCategory(category: Categories) {
        let link: Locator;
        switch (category) {
            case Categories.Accessories:
                link = this.shopByCategory.getByRole('link', { name: 'Accessories' })
                break;
            case Categories.Hoodies:
                link = this.shopByCategory.getByRole('link', { name: `${category.toString()}` })
                break;
            default:
                throw new Error("Unimplimented Category")
                break;
        }
        await link.click();
    }

}

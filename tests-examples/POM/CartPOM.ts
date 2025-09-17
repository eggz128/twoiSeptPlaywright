import { Page, Locator, expect } from '@playwright/test'
import { NavComponentPOM } from './NavComponentPOM';
import { BasePOM } from './BasePOM';

export class CartPOM extends BasePOM { //CartPOM IS-A BasePOM

    //Fields
    //page: Page //Get this from the base class

    //Components - Things this page (but not all other pages) has
    nav: NavComponentPOM

    //Locators - unique to Cart Page
    

    constructor(page: Page) {
        super(page) //super must be called before 'this' is used

        //The Cart Page HAS-A navbar
        this.nav = new NavComponentPOM(page);

        //Init locator fields
        
    }
    
    async navigate(){await this.page.goto('https://www.edgewordstraining.co.uk/demo-site/cart')};

    //Service methods for handling the cart


}

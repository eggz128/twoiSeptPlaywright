import {Page, Locator} from '@playwright/test'

export class NavComponentPOM {

    //Fields
    page: Page
    //Components

    //Locator Fields
    navBar: Locator;
    home: Locator;
    shop: Locator;
    cart: Locator;
    checkout: Locator;

    constructor(page: Page){
        this.page = page;
        this.navBar = page.locator('#menu-main')
        this.home = this.navBar.getByRole('link',{name: 'Home'})
        this.shop = this.navBar.getByRole('link',{name: 'Shop'})
        this.cart = this.navBar.getByRole('link',{name: 'Cart'})
        this.checkout = this.navBar.getByRole('link',{name: 'Checkout'})
    }

    //Service methods
    async goHome(){await this.home.click()};
    async goShop(){await this.shop.click()};
    async goCart(){await this.cart.click()};
    async goCheckout(){await this.checkout.click()};

}
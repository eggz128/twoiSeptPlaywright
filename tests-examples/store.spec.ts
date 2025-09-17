import { test, expect } from '@playwright/test';
import { Categories, HomePOM } from './POM/HomePOM';
import { CartPOM } from './POM/CartPOM';

// test.beforeEach('Load store',async ({page})=>{
//     await page.goto('https://www.edgewordstraining.co.uk/demo-site')
// })

test('Just some ideas', async ({page})=>{
    const home = new HomePOM(page);
    await home.navigate();
    await home.dismissDemoBanner(); //Method comes from BasePOM
    await home.nav.goCart(); //HomePOM HAS-A nav
    const cart = new CartPOM(page);
    await cart.nav.goHome(); //CartPOM also HAS-A nav
    //await cart.dismissDemoBanner(); 
    const home2 = new HomePOM(page); //Could just reuse home...but this does make it clear we are ona "new" home page...
    await home2.shopCategory(Categories.Accessories)

})
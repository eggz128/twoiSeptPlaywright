import { request, test, expect } from '@playwright/test';
let baseRequestUrl = 'http://localhost:2002/api';

test('Simple Get', async({request})=>{
    const resp = await request.get('http://localhost:2002/api/products/1');
    try{
        expect(resp.status()).toBe(200);
    } catch (error) {
        console.log(`Simple GET failed with ${resp.statusText()}` );
        throw error;
    }
});

test('Check GET response body', async({request})=>{
    const resp = await request.get(baseRequestUrl + '/products/2')
    try {
        expect.soft(resp.status()).toEqual(200) //soft asserts to allow multiple checks
        expect.soft(await resp.json()).toHaveProperty('price')
        expect.soft(await resp.json()).toMatchObject({
            "id": 1,
            "name": "iPad",
            "price": 500
          })

    } catch(error){
        console.log("Simple GET request failed with status :" + resp.statusText())
        throw error
    }
})

test('Basic auth', async({playwright})=>{
    const context = await playwright.request.newContext({ //new context required (different from norm without basic auth)
        baseURL: baseRequestUrl,
        httpCredentials: {
            username: 'edge',
            password: 'edgewords'
        }
    });
    const resp = await context.get(baseRequestUrl + '/users');
    expect(resp.status()).toEqual(200);
    console.log((await resp.body()).toString());
});


test('POST a new product', async ({request})=>{
    const newProd = await request.post(baseRequestUrl + '/products', {
        data: {
            name: 'RazorMouse',
            price: 20,
        },
    });
    expect(newProd.status()).toEqual(201);

    const jsonData = await newProd.json();
    console.log('New product created with id: ' + jsonData.id);
})
import fs from 'fs';
import puppeteer from 'puppeteer';

export async function testHvZLogin(exePath) {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        executablePath: exePath,
    });
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    
    try {
        fs.writeFileSync('debug/hvz/responseURLs.txt', "");
        fs.writeFileSync('debug/hvz/requestURLs.txt', "");
    } catch (err) { console.log(err); }

    page.on('response', response => {
        fs.appendFile('debug/hvz/responseURLs.txt', response.url() + "\n", err => {
            if (err) { console.log(err); }
        });
    });

    page.on('request', request => {
        fs.appendFile('debug/hvz/requestURLs.txt', request.url() + "\n", err => {
            if (err) { console.log(err); }
        });
    });

    // Navigate the page to a URL.
    await page.goto('https://casehvz.com');

    // Set screen size.
    // This is the screen size on my laptop
    await page.setViewport({width: 1200, height: 875});

    // Click the hamburger menu icon
    await page.locator('button').filter(button => button.ariaLabel === "menu").click();
    await page.waitForNetworkIdle();
    await page.screenshot({ path: 'debug/hvz/ss.png', });

    // Click the "Log in" button in the hamburger menu
    await page.locator('button').filter(button => button.tabIndex === 0).click();
    await page.waitForNetworkIdle();
    await page.screenshot({ path: 'debug/hvz/ss2.png', });

    // Type my username into case's username field
    await page.locator('input').filter(input => input.name === "username").fill('lrl47');
    await page.waitForNetworkIdle();
    await page.screenshot({ path: 'debug/hvz/ss3.png', });

    // Type passphrase into passphrase field
    await page.keyboard.press('Tab');
    await page.keyboard.type('FourTris #069420 5l3e5v8i7');
    await page.waitForNetworkIdle();
    await page.screenshot({ path: 'debug/hvz/ss4.png', });

    // Click Login button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.waitForNetworkIdle();
    await page.screenshot({ path: 'debug/hvz/ss5.png', });


    await browser.close();
}
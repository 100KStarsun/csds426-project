import fs from 'fs';
import puppeteer from 'puppeteer';

export async function testDailyWiki() {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch();
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    
    try {
        fs.writeFileSync('wiki-daily-test/responseURLs.txt', "");
        fs.writeFileSync('wiki-daily-test/requestURLs.txt', "");
    } catch (err) { console.log(err); }

    page.on('response', response => {
        fs.appendFile('wiki-daily-test/responseURLs.txt', response.url() + "\n", err => {
            if (err) { console.log(err); }
        });
    });

    page.on('request', request => {
        fs.appendFile('wiki-daily-test/requestURLs.txt', request.url() + "\n", err => {
            if (err) { console.log(err); }
        });
    });

    // Navigate the page to a URL.
    await page.goto('https://en.wikipedia.org/wiki/Main_Page');

    // Set screen size.
    // This is the screen size on my laptop
    await page.setViewport({width: 1600, height: 875});

    await page.waitForNetworkIdle();
    const recentFeatures = await page.waitForSelector('.tfa-recent')
    await recentFeatures.screenshot({ path: 'wiki-daily-test/recentFeaturesDiv.png', })

    const recentFeature1 = await recentFeatures.jsonValue();
    console.log(recentFeature1);
    // const recentFeature2 = 
    // const recentFeature3 = 



    await browser.close();
}
import fs from 'fs';
import puppeteer from 'puppeteer';

export async function testDailyWiki(browserName, exePath) {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        executablePath: ['chrome', 'firefox'].includes(browserName) ? null : exePath,
        browser: ['chrome', 'firefox'].includes(browserName) ? browserName : 'chrome',
    });
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

    const start = (new Date()).getTime();
    
    // Navigate the page to a URL.
    await page.goto('https://en.wikipedia.org/wiki/Main_Page');

    // Set screen size.
    // This is the screen size on my laptop
    await page.setViewport({width: 1600, height: 875});

    await page.waitForNetworkIdle();
    const recentFeaturesOuterDiv = await page.waitForSelector('.tfa-recent');
    const recentFeatures = await recentFeaturesOuterDiv.waitForSelector('.hlist.inline');
    const elementHandles = await recentFeatures.$$('a');
    const propertyJSHandles = await Promise.all(elementHandles.map(handle => handle.getProperty('href')));
    const hrefs = await Promise.all(propertyJSHandles.map(handle => handle.jsonValue()));
    console.log(hrefs);
    const end = (new Date()).getTime();
    var totalTime = end-start;
    for (var i = 0; i < hrefs.length; i++) {
        const tempBrowser = await puppeteer.launch({
            executablePath: ['chrome', 'firefox'].includes(browserName) ? null : exePath,
            browser: ['chrome', 'firefox'].includes(browserName) ? browserName : 'chrome',
        });
        const link = hrefs[i];
        const tempContext = await tempBrowser.createBrowserContext();
        const tempPage = await tempContext.newPage();
        await tempPage.setViewport({width: 1600, height: 875});
        const tempStart = (new Date()).getTime();
        await tempPage.goto(link);
        await tempPage.waitForNetworkIdle();
        await tempPage.screenshot({ path: 'wiki-daily-test/' + link.substring(29) + '.png', });
        const tempEnd = (new Date()).getTime();
        await tempBrowser.close();
        totalTime += (tempEnd - tempStart);
    }

    await browser.close();
    return totalTime;
}
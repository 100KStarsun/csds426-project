import fs from 'fs';
import puppeteer from 'puppeteer';

export async function testFandom(browserName, exePath, useOperaAdBlocker) {
    // Launch the browser and open a new blank page
    const args = {
        executablePath: ['chrome', 'firefox'].includes(browserName) ? null : exePath,
        browser: ['chrome', 'firefox'].includes(browserName) ? browserName : 'chrome',
        headless: true,
        ignoreDefaultArgs: true,
        args: ['--user-data-dir=\"C:\\Users\\100ks\\Desktop\\opera-test\\profile\\data\"'],
    }
    if (!useOperaAdBlocker) {
        delete args.args;
        delete args.ignoreDefaultArgs;
    }
    const browser = await puppeteer.launch(args);
    // const context = await browser.createBrowserContext();
    // const browser = await puppeteer.connect({
    //     browserWSEndpoint: 'ws://127.0.0.1:34567/devtools/browser/2a7694f9-3476-48f4-bed8-7a5a4a78035b',
    // })
    const page = await browser.newPage();
    
    try {
        fs.writeFileSync('debug/fandom/responseURLs.txt', "");
        fs.writeFileSync('debug/fandom/requestURLs.txt', "");
    } catch (err) { console.log(err); }

    page.on('response', response => {
        fs.appendFile('debug/fandom/responseURLs.txt', response.url() + "\n", err => {
            if (err) { console.log(err); }
        });
    });

    page.on('request', request => {
        fs.appendFile('debug/fandom/requestURLs.txt', request.url() + "\n", err => {
            if (err) { console.log(err); }
        });
    });

    const start = (new Date()).getTime();
    
    // Navigate the page to a URL.
    await page.goto('https://www.fandom.com/');

    // Set screen size.
    // This is the screen size on my laptop
    await page.setViewport({width: 1600, height: 875});

    await page.waitForNetworkIdle();
    const topInnerDivs = await page.$$('.top-wikis-block__item-container');
    const topInnerDivsJSHandles = await Promise.all(topInnerDivs.map(handle => handle.getProperty('innerText')));
    const innerTexts = await Promise.all(topInnerDivsJSHandles.map(handle => handle.jsonValue()));
    //console.log(innerTexts);
    const index = getGamesIndex(innerTexts);
    //console.log(innerTexts[index]); // check if index is correct (spoiler: it should be)
    const outerGameDiv = topInnerDivs[index];
    const elementHandles = await outerGameDiv.$$('a');
    const propertyJSHandles = await Promise.all(elementHandles.map(handle => handle.getProperty('href')));
    const hrefs = await Promise.all(propertyJSHandles.map(handle => handle.jsonValue()));
    console.log(hrefs);

    
    const end = (new Date()).getTime();
    var totalTime = end-start;
    for (var i = 0; i < hrefs.length; i++) {
        // const tempBrowser = await puppeteer.launch({
        //     executablePath: ['chrome', 'firefox'].includes(browserName) ? null : exePath,
        //     browser: ['chrome', 'firefox'].includes(browserName) ? browserName : 'chrome',
        //     headless: false,
        //     ignoreDefaultArgs: ['--disable-extensions'],
        //     args: ['--enable-extensions'],
        //     // args: ['--load-extension=\"C:\\Users\\100ks\\AppData\\Roaming\\Opera Software\\Opera GX Stable\\Extensions\\enegjkbbakeegngfapepobipndnebkdk\\1.1.3_0\\targeted_sd_section.js\"'],
        //     //args: ['--user-data-dir=\"C:\\Users\\100ks\\AppData\\Roaming\\Opera Software\\Opera GX Stable\"',],
        // });
        const link = hrefs[i];
        // const tempContext = await tempBrowser.createBrowserContext();
        const tempPage = await browser.newPage();
        await tempPage.setViewport({width: 1600, height: 875});
        const tempStart = (new Date()).getTime();
        await tempPage.goto(link);
        await tempPage.waitForNetworkIdle();
        await tempPage.screenshot({ path: 'debug/fandom/' + link.substring(8,link.indexOf('.')) + '.png', });
        const tempEnd = (new Date()).getTime();
        await tempPage.close();
        // await tempBrowser.close();
        totalTime += (tempEnd - tempStart);
    }

    await browser.close();
    return totalTime;
}

function getGamesIndex(jsonArr) {
    for (var i = 0; i < jsonArr.length; i++) {
        if (jsonArr[i].includes('GAMES')) {
            return i;
        }
    }
    return -1;
}
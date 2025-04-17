import puppeteer from 'puppeteer-extra';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';

function getArgs (browserName, adblockEnabled) {

    const browsersMap = {
        'operagx': 'C:\\Users\\100ks\\Desktop\\opera-test\\opera.exe',
        'chrome': 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'firefox': 'C:\\Program Files\\Mozilla Firefox\\firefox.exe'
    }

    const args = {
        executablePath: ['chrome', 'firefox'].includes(browserName) ? null : browsersMap[browserName],
        browser: ['chrome', 'firefox'].includes(browserName) ? browserName : 'chrome',
        headless: false,
        devtools: true,
    }
    return args;
}



export async function testBrowser(browserName, adblockEnabled, websites, data) {
    if (adblockEnabled) {
        puppeteer.use(AdblockerPlugin({ blockTrackers: true }))
    }
    const results = [];
    const idleTimeMs = 750;
    // Launch the browser and open a new blank page
    const args = getArgs(browserName, adblockEnabled);
    console.log(args);
    const browser = await puppeteer.launch(args);


    for await (const website of websites) {
        if (website in data) {
            console.log(typeof(data[website]) + ": " + data[website]);
        }
        var didTimeout = false;
        process.stdout.write(website + "\n\t--> ");
        // Create a page
        const page = await browser.newPage();
        // Set screen size, disable cache
        await page.setViewport({width: 1920, height: 1080});
        await page.setCacheEnabled(false);
        // Start the timer, and navigate the page to the URL
        const start = (new Date()).getTime();
        try {
            await page.goto(website);
            // Wait for page to finish loading, then calculate time to load
            await page.waitForNetworkIdle(
                {
                    concurrency: 2,
                    idleTime: idleTimeMs
                }
            );
        } catch (err) {
            didTimeout = true;
            console.log(err);
        }
        const end = (new Date()).getTime();
        await page.close();
        const totalTime = end-start-idleTimeMs;
        const stringToAdd = didTimeout ? " (timeout)\n\n" : "\n\n";
        process.stdout.write("" + totalTime + "ms" + stringToAdd);
        const times = [];
        if (!(website in data)) {
            times.push(totalTime);
            data[website] = times;
        } else {
            data[website].push(totalTime);
        }
        results.push(totalTime);
    }

    await browser.close();
}
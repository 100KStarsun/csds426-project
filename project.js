import fs from 'fs';
import { testBrowser } from './browser-test.js';

var websites = []

const websitesFile = "test-websites.txt";

try {
    const data = fs.readFileSync(websitesFile, 'utf-8');
    websites = data.split('\r\n');
} catch (err) {
    console.log(err);
}



const trials = []
const numTrials = 2;
for (var i = 0; i < numTrials; i++) {
    trials.push(i);
}

const adblockOptions = [false, true];
const browsers = ["operagx", "chrome", "firefox"]
const config = {
    browser: "operagx",
    adblocker: false
}
for await (const adblockOption of adblockOptions) {
    config["adblocker"] = adblockOption
    for await (const browser of browsers) {
        config["browser"] = browser
        var data = {}
        for await (const trialNum of trials) {
            
            await testBrowser(config.browser, config.adblocker, websites, data);
        }
        try {
            fs.writeFileSync("testdata/times-" + JSON.stringify(config) + ".json", JSON.stringify(data, null, 4));
        } catch (err) { console.log(err); }
    }
}

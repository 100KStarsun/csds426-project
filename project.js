import fs from 'fs';
import { testBrowser } from './browser-test.js';

var websites = []

const websitesFile = "websites-top.txt";

try {
    const data = fs.readFileSync(websitesFile, 'utf-8');
    websites = data.split('\r\n');
} catch (err) {
    console.log(err);
}



const trials = []
const numTrials = 3;
for (var i = 0; i < numTrials; i++) {
    trials.push(i);
}

const adblockOptions = [true, false];
const browsers = ["operagx", "chrome"]
const config = {
    browser: "operagx",
    adblocker: true
}
const browserTestOptions = {
    timeUntilIdle: 500,
    concurrentRequests: 2
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

for await (const adblockOption of adblockOptions) {
    config["adblocker"] = adblockOption
    for await (const browser of browsers) {
        config["browser"] = browser
        var data = {}
        for await (const trialNum of trials) {
            console.log(config.browser + " " + config.adblocker + " round: " + trialNum);
            await testBrowser(config.browser, config.adblocker, websites, data, browserTestOptions);
        }
        try {
            fs.writeFileSync("data/" + browserTestOptions.concurrentRequests + "con-" + browserTestOptions.timeUntilIdle + "ms-data/" + config.browser + "-" + config.adblocker + "-times.json", JSON.stringify(data, null, 4));
            fs.writeFileSync("data/" + config.browser + "-" + config.adblocker + "-times.json", JSON.stringify(data, null, 4));
        } catch (err) { console.log(err); }
    }
}

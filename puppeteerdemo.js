import fs from 'fs';
import { testDailyWiki } from "./wiki-daily-test/wiki-test.js";

const application = 'operagx';
const map = {
    'operagx': 'C:\\Users\\100ks\\AppData\\Local\\Programs\\Opera GX\\opera.exe',
    'chrome': 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'firefox': 'C:\\Program Files\\Mozilla Firefox\\firefox.exe'
}
const exePath = map[application];
fs.writeFileSync('wiki-daily-test/time.txt', "");
for (const key in map) {
    var avg = 0;
    var arr = [];
    for (var i = 0; i < 10; i++) {
        const time = await testDailyWiki(key, map[key]);
        arr.push(time);
        avg += time;
    }
    avg /= 10.0;
    
    try {
        const browserString = exePath.substring(exePath.lastIndexOf('\\')+1, exePath.length-4);
        fs.appendFileSync('wiki-daily-test/time.txt', "Opera GX: " + avg + " ms | " + arr.toString());
    } catch (error) {}
}


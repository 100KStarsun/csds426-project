import fs from 'fs';
import puppeteer from 'puppeteer';
import { testFandom } from './fandom-test/fandom-test.js';

const application = 'operagx';
const map = {
    'operagx': 'C:\\Users\\100ks\\AppData\\Local\\Programs\\Opera GX\\opera.exe',
    'chrome': 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'firefox': 'C:\\Program Files\\Mozilla Firefox\\firefox.exe'
}
fs.writeFileSync('data/fandom/time.txt', "");
console.log(puppeteer.defaultArgs());

const time = await testFandom(application, map[application]);
console.log(time);

// for (const key in map) {
//     var avg = 0;
//     var arr = [];
//     for (var i = 0; i < 10; i++) {
//         const time = await testFandom(key, map[key]);
//         arr.push(time);
//         avg += time;
//     }
//     avg /= 10.0;
    
//     try {
//         const browserString = exePath.substring(exePath.lastIndexOf('\\')+1, exePath.length-4);
//         fs.appendFileSync('data/fandom/time.txt', key + ": " + avg + " ms | " + arr.toString());
//     } catch (error) {}
// }


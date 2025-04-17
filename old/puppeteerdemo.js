import fs from 'fs';
import { testFandom } from './fandom-test.js';

const application = 'chrome';
const map = {
    'operagx-adblock': 'C:\\Users\\100ks\\AppData\\Local\\Programs\\Opera GX\\opera.exe',
    'operagx': 'C:\\Users\\100ks\\AppData\\Local\\Programs\\Opera GX\\opera.exe',
    'chrome': 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'firefox': 'C:\\Program Files\\Mozilla Firefox\\firefox.exe'
}
fs.writeFileSync('data/fandom/time.txt', "");
const useOperaAdBlocker = true;
const time = await testFandom(application, map[application], false);
console.log(time);

for (const key in map) {
    var avg = 0;
    var arr = [];
    for (var i = 0; i < 3; i++) {
        const time = await testFandom(key, map[key], key.includes('adblock'));
        arr.push(time);
        avg += time;
    }
    avg /= 3.0;
    
    try {
        const browserString = exePath.substring(exePath.lastIndexOf('\\')+1, exePath.length-4);
        fs.appendFileSync('data/fandom/time.txt', key + ": " + avg + " ms | " + arr.toString());
    } catch (error) {}
}


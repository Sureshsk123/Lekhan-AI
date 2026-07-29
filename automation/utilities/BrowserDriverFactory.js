import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import firefox from 'selenium-webdriver/firefox.js';
import { CONSTANTS } from './Constants.js';
import { envManager } from './EnvironmentManager.js';
import { logger } from './LoggerUtility.js';
import fs from 'fs';
import path from 'path';

export class BrowserDriverFactory {
    static async createDriver() {
        const browser = envManager.getBrowser().toLowerCase();
        const isHeadless = envManager.isHeadless();
        const workerId = process.env.MOCHA_WORKER_ID || '0';
        
        logger.info(`Creating driver for browser: ${browser} | Headless: ${isHeadless} | Worker: ${workerId}`);
        
        let builder = new Builder().forBrowser(browser);
        
        const downloadDir = path.resolve(process.cwd(), 'downloads', browser, `worker-${workerId}`);
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        switch (browser) {
            case CONSTANTS.BROWSERS.CHROME.toLowerCase():
                const chromeOptions = new chrome.Options();
                if (isHeadless) chromeOptions.addArguments('--headless');
                chromeOptions.addArguments('--start-maximized');
                chromeOptions.addArguments('--disable-gpu');
                chromeOptions.addArguments('--no-sandbox');
                
                chromeOptions.setUserPreferences({
                    'download.default_directory': downloadDir,
                    'download.prompt_for_download': false
                });
                
                builder.setChromeOptions(chromeOptions);
                break;

            case CONSTANTS.BROWSERS.FIREFOX.toLowerCase():
                const firefoxOptions = new firefox.Options();
                if (isHeadless) firefoxOptions.addArguments('--headless');
                
                firefoxOptions.setPreference('browser.download.folderList', 2);
                firefoxOptions.setPreference('browser.download.dir', downloadDir);
                firefoxOptions.setPreference('browser.download.useDownloadDir', true);
                firefoxOptions.setPreference('browser.helperApps.neverAsk.saveToDisk', 'application/pdf, text/csv');
                
                builder.setFirefoxOptions(firefoxOptions);
                break;
                
            case CONSTANTS.BROWSERS.EDGE.toLowerCase():
                // Edge options can be configured similarly if needed
                break;

            default:
                throw new Error(`Unsupported browser: ${browser}`);
        }

        const driver = await builder.build();
        await driver.manage().setTimeouts({ implicit: envManager.getImplicitWait() });
        return driver;
    }
}

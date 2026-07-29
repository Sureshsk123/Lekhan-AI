import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import firefox from 'selenium-webdriver/firefox.js';
import { CONSTANTS } from './Constants.js';
import { envManager } from './EnvironmentManager.js';
import { logger } from './LoggerUtility.js';

export class BrowserDriverFactory {
    static async createDriver() {
        const browser = envManager.getBrowser();
        const isHeadless = envManager.isHeadless();
        
        logger.info(`Creating driver for browser: ${browser} | Headless: ${isHeadless}`);
        
        let builder = new Builder().forBrowser(browser);

        switch (browser.toLowerCase()) {
            case CONSTANTS.BROWSERS.CHROME:
                const chromeOptions = new chrome.Options();
                if (isHeadless) chromeOptions.addArguments('--headless');
                chromeOptions.addArguments('--start-maximized');
                chromeOptions.addArguments('--disable-gpu');
                chromeOptions.addArguments('--no-sandbox');
                builder.setChromeOptions(chromeOptions);
                break;

            case CONSTANTS.BROWSERS.FIREFOX:
                const firefoxOptions = new firefox.Options();
                if (isHeadless) firefoxOptions.addArguments('--headless');
                builder.setFirefoxOptions(firefoxOptions);
                break;
                
            case CONSTANTS.BROWSERS.EDGE:
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

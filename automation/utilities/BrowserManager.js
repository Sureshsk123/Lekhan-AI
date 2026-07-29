import { BrowserDriverFactory } from './BrowserDriverFactory.js';
import { logger } from './LoggerUtility.js';

export class BrowserManager {
    static async getDriver() {
        if (!this.driver) {
            this.driver = await BrowserDriverFactory.createDriver();
            await this.driver.manage().window().maximize();
        }
        return this.driver;
    }

    static async quitDriver() {
        if (this.driver) {
            logger.info('Quitting driver session...');
            await this.driver.quit();
            this.driver = null;
        }
    }

    static async navigateTo(url) {
        if (this.driver) {
            logger.info(`Navigating to: ${url}`);
            await this.driver.get(url);
        }
    }

    static async clearCookies() {
        if (this.driver) {
            logger.info('Clearing browser cookies');
            await this.driver.manage().deleteAllCookies();
        }
    }
}

import { BrowserDriverFactory } from './BrowserDriverFactory.js';
import { logger } from './LoggerUtility.js';

export class BrowserManager {
    static async getDriver() {
        if (!this.driverPromise) {
            this.driverPromise = (async () => {
                const driver = await BrowserDriverFactory.createDriver();
                await driver.manage().window().maximize();
                return driver;
            })();
        }
        this.driver = await this.driverPromise;
        return this.driver;
    }

    static async quitDriver() {
        if (this.driver) {
            logger.info('Quitting driver session...');
            await this.driver.quit();
            this.driver = null;
            this.driverPromise = null;
        } else if (this.driverPromise) {
            const driver = await this.driverPromise;
            await driver.quit();
            this.driver = null;
            this.driverPromise = null;
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

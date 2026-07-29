import { until } from 'selenium-webdriver';
import { envManager } from './EnvironmentManager.js';
import { logger } from './LoggerUtility.js';

export class WaitUtility {
    constructor(driver) {
        this.driver = driver;
        this.timeout = envManager.getExplicitWait();
    }

    async waitForElementVisible(locator, timeout = this.timeout) {
        logger.info(`Waiting for element to be visible: ${locator}`);
        return await this.driver.wait(until.elementLocated(locator), timeout)
            .then(element => this.driver.wait(until.elementIsVisible(element), timeout));
    }

    async waitForElementClickable(locator, timeout = this.timeout) {
        logger.info(`Waiting for element to be clickable: ${locator}`);
        const element = await this.waitForElementVisible(locator, timeout);
        return await this.driver.wait(until.elementIsEnabled(element), timeout);
    }
}

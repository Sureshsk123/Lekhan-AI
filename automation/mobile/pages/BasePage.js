import { WaitUtility } from '../utilities/WaitUtility.js';
import { GestureUtility } from '../utilities/GestureUtility.js';
import { logger } from '../utilities/LoggerUtility.js';

export class BasePage {
    constructor(driver) {
        this.driver = driver;
        this.gestures = new GestureUtility(driver);
    }

    async getElement(selector) {
        const el = await this.driver.$(selector);
        await WaitUtility.waitForExist(el);
        return el;
    }

    async clickElement(selector) {
        logger.info(`Clicking element: ${selector}`);
        const el = await this.getElement(selector);
        await WaitUtility.waitForDisplayed(el);
        await el.click();
    }

    async enterText(selector, text) {
        logger.info(`Entering text into element: ${selector}`);
        const el = await this.getElement(selector);
        await WaitUtility.waitForDisplayed(el);
        await el.setValue(text);
    }

    async getText(selector) {
        logger.info(`Getting text from element: ${selector}`);
        const el = await this.getElement(selector);
        await WaitUtility.waitForDisplayed(el);
        return await el.getText();
    }

    async isElementDisplayed(selector) {
        logger.info(`Checking if element is displayed: ${selector}`);
        try {
            const el = await this.driver.$(selector);
            return await WaitUtility.waitForDisplayed(el, 5000);
        } catch (e) {
            return false;
        }
    }
}

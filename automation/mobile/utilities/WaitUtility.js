import { logger } from './LoggerUtility.js';
import { ConfigReader } from './ConfigReader.js';

export class WaitUtility {
    static async waitForDisplayed(element, timeout = null) {
        const waitTime = timeout || ConfigReader.getConfig().implicitWait || 10000;
        try {
            await element.waitForDisplayed({ timeout: waitTime });
            return true;
        } catch (error) {
            logger.warn(`Element not displayed after ${waitTime}ms`);
            return false;
        }
    }

    static async waitForExist(element, timeout = null) {
        const waitTime = timeout || ConfigReader.getConfig().implicitWait || 10000;
        try {
            await element.waitForExist({ timeout: waitTime });
            return true;
        } catch (error) {
            logger.warn(`Element does not exist after ${waitTime}ms`);
            return false;
        }
    }

    static async waitUntil(condition, timeout = null, timeoutMsg = 'Condition not met') {
        const waitTime = timeout || ConfigReader.getConfig().implicitWait || 10000;
        try {
            await browser.waitUntil(condition, {
                timeout: waitTime,
                timeoutMsg: timeoutMsg
            });
            return true;
        } catch (error) {
            logger.warn(`WaitUntil failed: ${error.message}`);
            return false;
        }
    }
}

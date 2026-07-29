import { until, By } from 'selenium-webdriver';
import { envManager } from './EnvironmentManager.js';
import { logger } from './LoggerUtility.js';
import { RetryUtility } from './RetryUtility.js';

export class CommonActions {
    constructor(driver) {
        this.driver = driver;
        this.timeout = envManager.getExplicitWait();
    }

    async waitForVisible(locator) {
        logger.info(`Waiting for element to be visible: ${locator}`);
        return await RetryUtility.retryBlock(async () => {
            const element = await this.driver.wait(until.elementLocated(locator), this.timeout);
            return await this.driver.wait(until.elementIsVisible(element), this.timeout);
        });
    }

    async waitForClickable(locator) {
        logger.info(`Waiting for element to be clickable: ${locator}`);
        return await RetryUtility.retryBlock(async () => {
            const element = await this.waitForVisible(locator);
            return await this.driver.wait(until.elementIsEnabled(element), this.timeout);
        });
    }

    async click(locator) {
        logger.info(`Clicking element: ${locator}`);
        await RetryUtility.retryBlock(async () => {
            const element = await this.waitForClickable(locator);
            await element.click();
        });
    }

    async type(locator, text) {
        logger.info(`Typing text into element: ${locator}`);
        await RetryUtility.retryBlock(async () => {
            const element = await this.waitForVisible(locator);
            await element.clear();
            await element.sendKeys(text);
        });
    }

    async clear(locator) {
        logger.info(`Clearing element: ${locator}`);
        await RetryUtility.retryBlock(async () => {
            const element = await this.waitForVisible(locator);
            await element.clear();
        });
    }

    async jsClick(locator) {
        logger.info(`JS Clicking element: ${locator}`);
        await RetryUtility.retryBlock(async () => {
            const element = await this.waitForVisible(locator);
            await this.driver.executeScript("arguments[0].click();", element);
        });
    }

    async scrollTo(locator) {
        logger.info(`Scrolling to element: ${locator}`);
        await RetryUtility.retryBlock(async () => {
            const element = await this.waitForVisible(locator);
            await this.driver.executeScript("arguments[0].scrollIntoView(true);", element);
        });
    }

    async selectDropdown(locator, optionText) {
        logger.info(`Selecting dropdown option '${optionText}' for element: ${locator}`);
        await this.click(locator);
        const optionLocator = By.xpath(`//option[text()='${optionText}'] | //li[text()='${optionText}'] | //div[text()='${optionText}']`);
        await this.click(optionLocator);
    }

    async hover(locator) {
        logger.info(`Hovering over element: ${locator}`);
        await RetryUtility.retryBlock(async () => {
            const element = await this.waitForVisible(locator);
            const actions = this.driver.actions({ bridge: true });
            await actions.move({ origin: element }).perform();
        });
    }

    async dragAndDrop(sourceLocator, targetLocator) {
        logger.info(`Dragging from ${sourceLocator} to ${targetLocator}`);
        await RetryUtility.retryBlock(async () => {
            const source = await this.waitForVisible(sourceLocator);
            const target = await this.waitForVisible(targetLocator);
            const actions = this.driver.actions({ bridge: true });
            await actions.dragAndDrop(source, target).perform();
        });
    }

    async uploadFile(locator, filePath) {
        logger.info(`Uploading file ${filePath} to element: ${locator}`);
        await RetryUtility.retryBlock(async () => {
            const element = await this.driver.findElement(locator);
            await element.sendKeys(filePath);
        });
    }
    
    async getText(locator) {
        logger.info(`Getting text from element: ${locator}`);
        return await RetryUtility.retryBlock(async () => {
            const element = await this.waitForVisible(locator);
            return await element.getText();
        });
    }
    
    async isDisplayed(locator) {
        try {
            const element = await this.waitForVisible(locator);
            return await element.isDisplayed();
        } catch(e) {
            return false;
        }
    }
}

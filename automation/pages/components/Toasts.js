import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';

export class Toasts extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = {
            toastContainer: By.css('.Toastify, .go3958317564, [role="alert"]'),
            toastMessage: By.css('.Toastify__toast-body, [role="alert"] div')
        };
    }

    async getToastMessage() {
        return await this.actions.getText(this.locators.toastMessage);
    }

    async waitForToastToDisappear() {
        // Wait for the toast element to no longer be present or visible
        const elements = await this.driver.findElements(this.locators.toastContainer);
        if (elements.length > 0) {
            await this.driver.wait(async () => {
                const isDisplayed = await this.actions.isDisplayed(this.locators.toastContainer);
                return !isDisplayed;
            }, this.actions.timeout);
        }
    }
}

import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';

export class Modals extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = {
            modalContainer: By.css('[role="dialog"], .modal'),
            modalTitle: By.css('[role="dialog"] h2, [role="dialog"] h3, .modal-title'),
            closeButton: By.css('[role="dialog"] button[aria-label="Close"], .modal-close'),
            confirmButton: By.css('[role="dialog"] button.confirm, [role="dialog"] button.primary'),
            cancelButton: By.css('[role="dialog"] button.cancel, [role="dialog"] button.secondary')
        };
    }

    async getModalTitle() {
        return await this.actions.getText(this.locators.modalTitle);
    }

    async confirm() {
        await this.actions.click(this.locators.confirmButton);
    }

    async cancel() {
        await this.actions.click(this.locators.cancelButton);
    }

    async close() {
        await this.actions.click(this.locators.closeButton);
    }

    async isModalOpen() {
        return await this.actions.isDisplayed(this.locators.modalContainer);
    }
}

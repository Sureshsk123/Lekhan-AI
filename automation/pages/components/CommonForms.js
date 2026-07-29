import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';

export class CommonForms extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = {
            inputByName: (name) => By.css(`input[name="${name}"]`),
            inputByType: (type) => By.css(`input[type="${type}"]`),
            submitButton: By.css('button[type="submit"]')
        };
    }

    async fillInputByName(name, value) {
        await this.actions.type(this.locators.inputByName(name), value);
    }

    async submitForm() {
        await this.actions.click(this.locators.submitButton);
    }
}

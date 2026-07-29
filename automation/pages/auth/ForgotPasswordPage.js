import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';

export class ForgotPasswordPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = {
            emailInput: By.css('input[type="email"]'),
            submitButton: By.css('button[type="submit"]'),
            backToLoginLink: By.css('a[href="/login"]')
        };
    }

    async enterEmail(email) {
        await this.actions.type(this.locators.emailInput, email);
    }

    async submitRecovery() {
        await this.actions.click(this.locators.submitButton);
    }

    async recoverPassword(email) {
        await this.enterEmail(email);
        await this.submitRecovery();
    }

    async goBackToLogin() {
        await this.actions.click(this.locators.backToLoginLink);
    }
}

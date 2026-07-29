import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';

export class LoginPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = {
            emailInput: By.css('input[type="email"], input[name="email"]'),
            passwordInput: By.css('input[type="password"], input[name="password"]'),
            loginButton: By.css('button[type="submit"]'),
            signupLink: By.css('a[href="/signup"]'),
            forgotPasswordLink: By.css('a[href="/forgot-password"]')
        };
    }

    async enterEmail(email) {
        await this.actions.type(this.locators.emailInput, email);
    }

    async enterPassword(password) {
        await this.actions.type(this.locators.passwordInput, password);
    }

    async submitLogin() {
        await this.actions.click(this.locators.loginButton);
    }

    async loginAs(email, password) {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.submitLogin();
    }

    async goToSignup() {
        await this.actions.click(this.locators.signupLink);
    }

    async goToForgotPassword() {
        await this.actions.click(this.locators.forgotPasswordLink);
    }
}

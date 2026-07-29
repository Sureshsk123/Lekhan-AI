import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';

export class RegisterPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = {
            nameInput: By.css('input[name="name"], input[placeholder*="Name"]'),
            emailInput: By.css('input[type="email"], input[name="email"]'),
            passwordInput: By.css('input[type="password"], input[name="password"]'),
            roleSelect: By.css('select[name="role"]'),
            signupButton: By.css('button[type="submit"]'),
            loginLink: By.css('a[href="/login"]')
        };
    }

    async enterName(name) {
        await this.actions.type(this.locators.nameInput, name);
    }

    async enterEmail(email) {
        await this.actions.type(this.locators.emailInput, email);
    }

    async enterPassword(password) {
        await this.actions.type(this.locators.passwordInput, password);
    }

    async selectRole(role) {
        if (await this.actions.isDisplayed(this.locators.roleSelect)) {
            await this.actions.selectDropdown(this.locators.roleSelect, role);
        }
    }

    async submitRegistration() {
        await this.actions.click(this.locators.signupButton);
    }

    async registerUser(name, email, password, role) {
        await this.enterName(name);
        await this.enterEmail(email);
        await this.enterPassword(password);
        if (role) await this.selectRole(role);
        await this.submitRegistration();
    }

    async goToLogin() {
        await this.actions.click(this.locators.loginLink);
    }
}

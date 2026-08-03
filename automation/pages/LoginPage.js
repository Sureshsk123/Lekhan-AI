import { By } from 'selenium-webdriver';

export class LoginPage {
    constructor(driver) {
        this.driver = driver;
        this.emailInput = By.css('input[type="email"], #email');
        this.passwordInput = By.css('input[type="password"], #password');
        this.submitBtn = By.css('button[type="submit"]');
        this.errorMessage = By.css('.error-message, [role="alert"]');
    }

    async navigateTo(baseUrl) {
        await this.driver.get(`${baseUrl}#/login`);
    }

    async login(email, password) {
        await this.driver.findElement(this.emailInput).sendKeys(email);
        await this.driver.findElement(this.passwordInput).sendKeys(password);
        await this.driver.findElement(this.submitBtn).click();
    }
}

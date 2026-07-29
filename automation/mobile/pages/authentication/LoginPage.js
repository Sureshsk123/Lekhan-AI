import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';

export class LoginPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            emailInput: '~input_email',
            passwordInput: '~input_password',
            loginButton: '~btn_login',
            registerLink: '~link_register',
            forgotPasswordLink: '~link_forgot_password'
        };
    }

    async login(email, password) {
        logger.info(`Attempting login with email: ${email}`);
        await this.enterText(this.selectors.emailInput, email);
        await this.enterText(this.selectors.passwordInput, password);
        await this.clickElement(this.selectors.loginButton);
    }

    async navigateToRegister() {
        logger.info('Navigating to Registration Screen');
        await this.clickElement(this.selectors.registerLink);
    }

    async navigateToForgotPassword() {
        logger.info('Navigating to Forgot Password Screen');
        await this.clickElement(this.selectors.forgotPasswordLink);
    }
}

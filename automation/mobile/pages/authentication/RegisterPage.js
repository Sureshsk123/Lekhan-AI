import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';

export class RegisterPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            nameInput: '~input_register_name',
            emailInput: '~input_register_email',
            passwordInput: '~input_register_password',
            termsCheckbox: '~checkbox_terms',
            registerButton: '~btn_submit_registration'
        };
    }

    async registerUser(name, email, password) {
        logger.info(`Registering new user: ${name}, ${email}`);
        await this.enterText(this.selectors.nameInput, name);
        await this.enterText(this.selectors.emailInput, email);
        await this.enterText(this.selectors.passwordInput, password);
        
        const checkbox = await this.getElement(this.selectors.termsCheckbox);
        const isChecked = await checkbox.getAttribute('checked');
        if (isChecked !== 'true') {
            await this.clickElement(this.selectors.termsCheckbox);
        }

        await this.clickElement(this.selectors.registerButton);
    }
}

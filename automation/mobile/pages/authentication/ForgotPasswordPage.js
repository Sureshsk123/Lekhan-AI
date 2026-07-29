import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';

export class ForgotPasswordPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            emailInput: '~input_reset_email',
            resetButton: '~btn_send_reset_link'
        };
    }

    async requestPasswordReset(email) {
        logger.info(`Requesting password reset for: ${email}`);
        await this.enterText(this.selectors.emailInput, email);
        await this.clickElement(this.selectors.resetButton);
    }
}

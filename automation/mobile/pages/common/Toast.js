import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';

export class Toast extends BasePage {
    constructor(driver) {
        super(driver);
        // Assuming app uses custom Snackbar with accessibility ID or standard Android Toast
        this.selectors = {
            snackbarMessage: '~snackbar_text'
        };
    }

    async getToastMessage() {
        logger.info('Extracting toast/snackbar message');
        if (await this.isElementDisplayed(this.selectors.snackbarMessage)) {
            return await this.getText(this.selectors.snackbarMessage);
        }
        
        // Fallback to standard Android Toast xpath (notoriously flaky, but standard)
        try {
            const toastEl = await this.driver.$('//android.widget.Toast');
            return await toastEl.getText();
        } catch (e) {
            return null;
        }
    }
}

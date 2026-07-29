import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';
import { WaitUtility } from '../../utilities/WaitUtility.js';

export class LoadingScreen extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            spinner: '~global_loading_spinner'
        };
    }

    async waitForLoaderToDisappear(timeoutMs = 15000) {
        logger.info('Waiting for global loader to disappear...');
        try {
            const el = await this.driver.$(this.selectors.spinner);
            await el.waitForDisplayed({ timeout: 2000 }); // Fast check if it even appears
            await el.waitForDisplayed({ reverse: true, timeout: timeoutMs });
        } catch (e) {
            // Loader might not have appeared, which is fine
        }
    }
}

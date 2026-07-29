import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';

export class SplashPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            appLogo: '~splash_app_logo',
            loadingIndicator: '~splash_loading'
        };
    }

    async waitForSplashToComplete() {
        logger.info('Waiting for splash screen to complete');
        try {
            const logo = await this.driver.$(this.selectors.appLogo);
            await logo.waitForDisplayed({ reverse: true, timeout: 10000 });
        } catch (e) {
            logger.warn('Splash screen wait timed out or skipped');
        }
    }
}

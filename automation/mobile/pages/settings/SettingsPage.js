import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';

export class SettingsPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            darkModeToggle: '~toggle_dark_mode',
            notificationsToggle: '~toggle_notifications',
            logoutButton: '~btn_settings_logout'
        };
    }

    async toggleDarkMode() {
        logger.info('Toggling dark mode');
        await this.clickElement(this.selectors.darkModeToggle);
    }

    async toggleNotifications() {
        logger.info('Toggling notifications');
        await this.clickElement(this.selectors.notificationsToggle);
    }

    async logout() {
        logger.info('Logging out via Settings Screen');
        await this.clickElement(this.selectors.logoutButton);
    }
}

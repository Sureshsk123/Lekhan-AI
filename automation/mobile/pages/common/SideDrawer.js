import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';

export class SideDrawer extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            hamburgerIcon: '~drawer_open',
            settingsMenu: '~menu_settings',
            supportMenu: '~menu_support',
            logoutMenu: '~menu_logout'
        };
    }

    async openDrawer() {
        logger.info('Opening Side Drawer');
        await this.clickElement(this.selectors.hamburgerIcon);
    }

    async navigateToSettings() {
        await this.openDrawer();
        logger.info('Navigating to Settings via Drawer');
        await this.clickElement(this.selectors.settingsMenu);
    }

    async logout() {
        await this.openDrawer();
        logger.info('Logging out via Drawer');
        await this.clickElement(this.selectors.logoutMenu);
    }
}

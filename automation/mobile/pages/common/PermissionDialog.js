import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';

export class PermissionDialog extends BasePage {
    constructor(driver) {
        super(driver);
        // Native Android UIAutomator selectors for permissions
        this.selectors = {
            allowButton: 'id=com.android.permissioncontroller:id/permission_allow_button',
            allowForegroundButton: 'id=com.android.permissioncontroller:id/permission_allow_foreground_only_button',
            denyButton: 'id=com.android.permissioncontroller:id/permission_deny_button',
            permissionMessage: 'id=com.android.permissioncontroller:id/permission_message'
        };
    }

    async getPermissionMessage() {
        return await this.getText(this.selectors.permissionMessage);
    }

    async grantPermission() {
        logger.info('Granting OS permission...');
        if (await this.isElementDisplayed(this.selectors.allowForegroundButton)) {
            await this.clickElement(this.selectors.allowForegroundButton);
        } else {
            await this.clickElement(this.selectors.allowButton);
        }
    }

    async denyPermission() {
        logger.info('Denying OS permission...');
        await this.clickElement(this.selectors.denyButton);
    }
}

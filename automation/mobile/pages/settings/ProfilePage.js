import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';

export class ProfilePage extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            profileNameInput: '~input_profile_name',
            profileEmailDisplay: '~txt_profile_email',
            saveProfileButton: '~btn_save_profile',
            profileAvatar: '~img_profile_avatar'
        };
    }

    async updateProfileName(newName) {
        logger.info(`Updating profile name to: ${newName}`);
        await this.enterText(this.selectors.profileNameInput, newName);
        await this.clickElement(this.selectors.saveProfileButton);
    }

    async getProfileEmail() {
        return await this.getText(this.selectors.profileEmailDisplay);
    }
}

import { SettingsPage } from '../pages/settings/SettingsPage.js';
import { ProfilePage } from '../pages/settings/ProfilePage.js';
import { LoggerUtility as logger } from '../utilities/LoggerUtility.js';
import { RetryUtility } from '../utilities/RetryUtility.js';
import { ScreenshotUtility } from '../utilities/ScreenshotUtility.js';

export class SettingsFlow {
    constructor(driver, navManager, context) {
        this.driver = driver;
        this.navManager = navManager;
        this.context = context;

        this.settingsPage = new SettingsPage(driver);
        this.profilePage = new ProfilePage(driver);
    }

    async updateProfile(profileData) {
        this.context.startFlow('SettingsFlow.updateProfile');
        logger.info('[Flow] Executing Profile Update flow');

        try {
            await this.navManager.gotoProfile();
            
            await RetryUtility.retry(async () => {
                if (profileData.name) {
                    await this.profilePage.updateProfileName(profileData.name);
                }
            }, 2, 1000);

            this.context.completeFlow('SettingsFlow.updateProfile');
            logger.info('[Flow] Profile updated successfully');
        } catch (error) {
            await ScreenshotUtility.captureFailure(this.driver, 'Flow_UpdateProfile_Failed');
            logger.error(`[Flow] Update Profile failed: ${error.message}`);
            throw new Error(`SettingsFlow.updateProfile failed: ${error.message}`);
        }
    }

    async changeTheme() {
        this.context.startFlow('SettingsFlow.changeTheme');
        logger.info('[Flow] Executing Theme Change flow');

        try {
            await this.navManager.gotoSettings();
            
            await RetryUtility.retry(async () => {
                await this.settingsPage.toggleDarkMode();
            }, 2, 1000);

            this.context.completeFlow('SettingsFlow.changeTheme');
            logger.info('[Flow] Theme changed successfully');
        } catch (error) {
            await ScreenshotUtility.captureFailure(this.driver, 'Flow_ChangeTheme_Failed');
            logger.error(`[Flow] Theme Change failed: ${error.message}`);
            throw new Error(`SettingsFlow.changeTheme failed: ${error.message}`);
        }
    }

    async changeLanguage() {
        logger.info('[Flow] Language change currently not fully implemented in UI');
        // Stub for future use
    }
}

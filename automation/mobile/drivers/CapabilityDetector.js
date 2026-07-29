import { LoggerUtility as logger } from '../utilities/LoggerUtility.js';

/**
 * CapabilityDetector evaluates the raw WebdriverIO capabilities
 * to determine what the driver was initialized to support.
 */
export class CapabilityDetector {
    constructor(driver) {
        this.driver = driver;
        this.capabilities = {};
    }

    async detect() {
        logger.info('[CapabilityDetector] Reading driver capabilities...');
        try {
            this.capabilities = await this.driver.capabilities;
            return this.capabilities;
        } catch (error) {
            logger.error(`[CapabilityDetector] Failed to read capabilities: ${error.message}`);
            return {};
        }
    }

    isAndroid() {
        const platformName = this.capabilities.platformName || '';
        return platformName.toLowerCase() === 'android';
    }

    isIOS() {
        const platformName = this.capabilities.platformName || '';
        return platformName.toLowerCase() === 'ios';
    }

    isUiAutomator2() {
        const automationName = this.capabilities.automationName || '';
        return automationName.toLowerCase() === 'uiautomator2';
    }

    isEspresso() {
        const automationName = this.capabilities.automationName || '';
        return automationName.toLowerCase() === 'espresso';
    }

    isXCUITest() {
        const automationName = this.capabilities.automationName || '';
        return automationName.toLowerCase() === 'xcuitest';
    }

    getPlatform() {
        if (this.isAndroid()) return 'Android';
        if (this.isIOS()) return 'iOS';
        return 'Unknown';
    }
}

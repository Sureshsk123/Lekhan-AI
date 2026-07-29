import { LoggerUtility as logger } from '../utilities/LoggerUtility.js';

/**
 * VersionDetector extracts OS, Driver, and Appium versions from the live session.
 */
export class VersionDetector {
    constructor(driver) {
        this.driver = driver;
        this.versions = {
            platformVersion: 'unknown',
            driverName: 'unknown',
            appiumVersion: 'unknown',
            deviceModel: 'unknown',
            deviceManufacturer: 'unknown'
        };
    }

    async detect() {
        logger.info('[VersionDetector] Initiating live session version detection...');
        
        try {
            const capabilities = await this.driver.capabilities;
            
            if (capabilities) {
                this.versions.platformVersion = capabilities.platformVersion || 'unknown';
                this.versions.driverName = capabilities.automationName || 'unknown';
                this.versions.deviceModel = capabilities.deviceModel || 'unknown';
                this.versions.deviceManufacturer = capabilities.deviceManufacturer || 'unknown';
            }

            // Attempt to get the actual Appium server version if available in session details
            const sessionDetails = await this.driver.getSession();
            if (sessionDetails && sessionDetails.appiumVersion) {
                this.versions.appiumVersion = sessionDetails.appiumVersion;
            } else {
                // Fallback for some WebdriverIO bindings where capabilities holds it
                this.versions.appiumVersion = capabilities?.['appium:version'] || 'unknown';
            }

            logger.info(`[VersionDetector] Detected: Platform=${this.versions.platformVersion}, Driver=${this.versions.driverName}`);
            
            return this.versions;
        } catch (error) {
            logger.warn(`[VersionDetector] Failed to detect versions: ${error.message}`);
            return this.versions;
        }
    }

    getDetectedVersions() {
        return { ...this.versions };
    }
}

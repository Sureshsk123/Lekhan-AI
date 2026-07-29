import { LoggerUtility as logger } from '../utilities/LoggerUtility.js';

class UnsupportedFeatureException extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnsupportedFeatureException';
    }
}

export class IOSDriverAdapter {
    constructor(driver, featureSupport) {
        this.driver = driver;
        this.featureSupport = featureSupport;
        this.metadata = { lastAction: null, fallbackUsed: false };
    }

    // ==========================================
    // LIFECYCLE MANAGEMENT
    // ==========================================

    async backgroundApp(seconds) {
        this._checkSupport('backgroundApp');
        logger.info(`[IOSAdapter] Backgrounding app for ${seconds} seconds`);
        
        try {
            await this.driver.background(seconds);
        } catch (error) {
            throw new UnsupportedFeatureException(`Background app failed: ${error.message}`);
        }
    }

    async terminate(bundleId) {
        this._checkSupport('appState');
        try {
            await this.driver.terminateApp(bundleId);
        } catch (e) {
            throw new UnsupportedFeatureException(`terminateApp failed: ${e.message}`);
        }
    }

    async activate(bundleId) {
        this._checkSupport('appState');
        try {
            await this.driver.activateApp(bundleId);
        } catch (e) {
            throw new UnsupportedFeatureException(`activateApp failed: ${e.message}`);
        }
    }

    async resetApp() {
        logger.info(`[IOSAdapter] Resetting app state`);
        try {
            await this.driver.reset();
        } catch (e) {
            throw new UnsupportedFeatureException(`resetApp failed: ${e.message}`);
        }
    }

    async installApp(appPath) {
        logger.info(`[IOSAdapter] Installing app from: ${appPath}`);
        try {
            await this.driver.installApp(appPath);
        } catch (e) {
            throw new UnsupportedFeatureException(`installApp failed: ${e.message}`);
        }
    }

    async removeApp(bundleId) {
        logger.info(`[IOSAdapter] Removing app: ${bundleId}`);
        try {
            await this.driver.removeApp(bundleId);
        } catch (e) {
            throw new UnsupportedFeatureException(`removeApp failed: ${e.message}`);
        }
    }

    async queryAppState(bundleId) {
        this._checkSupport('appState');
        try {
            return await this.driver.queryAppState(bundleId);
        } catch (e) {
            throw new UnsupportedFeatureException(`queryAppState failed: ${e.message}`);
        }
    }

    // ==========================================
    // KEYBOARD & INPUT
    // ==========================================

    async performActions(actions) {
        logger.info(`[IOSAdapter] Performing W3C actions`);
        try {
            await this.driver.performActions(actions);
        } catch (e) {
            throw new UnsupportedFeatureException(`performActions failed: ${e.message}`);
        }
    }

    async setClipboard(content, contentType) {
        this._checkSupport('clipboard');
        logger.info(`[IOSAdapter] Setting clipboard`);
        try {
            await this.driver.setClipboard(content, contentType);
        } catch (e) {
            throw new UnsupportedFeatureException(`setClipboard failed: ${e.message}`);
        }
    }

    async back() {
        logger.info(`[IOSAdapter] Pressing BACK`);
        try {
            await this.driver.back();
        } catch (e) {
            throw new UnsupportedFeatureException(`back failed: ${e.message}`);
        }
    }

    async pause(ms) {
        await this.driver.pause(ms);
    }

    async pressNext() {
        // iOS does not support Android keycodes
        throw new UnsupportedFeatureException('pressNext (via KeyCode) is not supported on iOS XCUITest.');
    }

    async pressDone() {
        throw new UnsupportedFeatureException('pressDone (via KeyCode) is not supported on iOS XCUITest.');
    }

    async pressClear() {
        throw new UnsupportedFeatureException('pressClear (via KeyCode) is not supported on iOS XCUITest.');
    }

    async hideKeyboard() {
        if (await this.driver.isKeyboardShown()) {
            try {
                await this.driver.hideKeyboard('tapOutside'); // Common iOS workaround
            } catch (e) {
                this.metadata.fallbackUsed = true;
                await this.driver.hideKeyboard('pressKey', 'Done');
            }
        }
    }

    async isKeyboardVisible() {
        return await this.driver.isKeyboardShown();
    }

    // ==========================================
    // DEEP LINKING
    // ==========================================

    async openDeepLink(uri) {
        this._checkSupport('deepLinks');
        logger.info(`[IOSAdapter] Opening Deep Link: ${uri}`);
        
        try {
            // iOS XCUITest requires passing deep links through Safari or specific Siri commands
            await this.driver.execute('mobile: deepLink', { url: uri });
        } catch (e) {
            throw new UnsupportedFeatureException(`Deep linking failed on iOS: ${e.message}`);
        }
    }

    // ==========================================
    // NETWORK MANAGEMENT
    // ==========================================

    async toggleAirplaneMode() {
        throw new UnsupportedFeatureException('Network control (Airplane Mode) is not natively supported by XCUITest without proxying.');
    }

    async enableNetwork() {
        throw new UnsupportedFeatureException('Network control (Enable Network) is not natively supported by XCUITest without proxying.');
    }

    // ==========================================
    // SCREEN MANAGEMENT
    // ==========================================

    async rotateLandscape() {
        this._checkSupport('screenRotation');
        await this.driver.setOrientation('LANDSCAPE');
    }

    async rotatePortrait() {
        this._checkSupport('screenRotation');
        await this.driver.setOrientation('PORTRAIT');
    }

    async currentOrientation() {
        this._checkSupport('screenRotation');
        return await this.driver.getOrientation();
    }

    async getWindowRect() {
        return await this.driver.getWindowRect();
    }

    async executeShellCommand(command) {
        throw new UnsupportedFeatureException(`executeShellCommand is not supported on iOS`);
    }

    // ==========================================
    // UTILS
    // ==========================================

    _checkSupport(feature) {
        if (!this.featureSupport.supports(feature)) {
            throw new UnsupportedFeatureException(`Feature '${feature}' is not supported on this iOS Driver configuration.`);
        }
    }

    getMetadata() {
        return { ...this.metadata };
    }
}

import { LoggerUtility as logger } from '../utilities/LoggerUtility.js';

class UnsupportedFeatureException extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnsupportedFeatureException';
    }
}

export class AndroidDriverAdapter {
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
        logger.info(`[AndroidAdapter] Backgrounding app for ${seconds} seconds`);
        
        try {
            await this.driver.background(seconds);
        } catch (error) {
            this.metadata.fallbackUsed = true;
            logger.warn(`[AndroidAdapter] Native background() failed, falling back to ADB shell...`);
            if (this.featureSupport.supports('adbShell')) {
                // Emulate HOME key press then wait, but it's hard to foreground without specific app package
                await this.driver.execute('mobile: shell', { command: 'input keyevent 3' });
                await this.driver.pause(seconds * 1000);
                // Note: Foregrounding requires passing the app package, omitted here for brevity
            } else {
                throw new UnsupportedFeatureException(`Background app failed completely: ${error.message}`);
            }
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
        logger.info(`[AndroidAdapter] Resetting app state`);
        try {
            await this.driver.reset();
        } catch (e) {
            throw new UnsupportedFeatureException(`resetApp failed: ${e.message}`);
        }
    }

    async installApp(appPath) {
        logger.info(`[AndroidAdapter] Installing app from: ${appPath}`);
        try {
            await this.driver.installApp(appPath);
        } catch (e) {
            throw new UnsupportedFeatureException(`installApp failed: ${e.message}`);
        }
    }

    async removeApp(bundleId) {
        logger.info(`[AndroidAdapter] Removing app: ${bundleId}`);
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
        logger.info(`[AndroidAdapter] Performing W3C actions`);
        try {
            await this.driver.performActions(actions);
        } catch (e) {
            throw new UnsupportedFeatureException(`performActions failed: ${e.message}`);
        }
    }

    async setClipboard(content, contentType) {
        this._checkSupport('clipboard');
        logger.info(`[AndroidAdapter] Setting clipboard`);
        try {
            await this.driver.setClipboard(content, contentType);
        } catch (e) {
            throw new UnsupportedFeatureException(`setClipboard failed: ${e.message}`);
        }
    }

    async back() {
        logger.info(`[AndroidAdapter] Pressing BACK`);
        try {
            await this.driver.back();
        } catch (e) {
            this.metadata.fallbackUsed = true;
            await this.driver.execute('mobile: shell', { command: 'input keyevent 4' });
        }
    }

    async pause(ms) {
        await this.driver.pause(ms);
    }

    async pressNext() {
        this._checkSupport('keyEvents');
        logger.info(`[AndroidAdapter] Pressing NEXT (Tab) key`);
        try {
            await this.driver.pressKeyCode(61); // KEYCODE_TAB
        } catch (e) {
            this.metadata.fallbackUsed = true;
            await this.driver.execute('mobile: shell', { command: 'input keyevent 61' });
        }
    }

    async pressDone() {
        this._checkSupport('keyEvents');
        logger.info(`[AndroidAdapter] Pressing DONE (Enter) key`);
        try {
            await this.driver.pressKeyCode(66); // KEYCODE_ENTER
        } catch (e) {
            this.metadata.fallbackUsed = true;
            await this.driver.execute('mobile: shell', { command: 'input keyevent 66' });
        }
    }

    async pressClear() {
        this._checkSupport('keyEvents');
        logger.info(`[AndroidAdapter] Pressing CLEAR key`);
        try {
            await this.driver.pressKeyCode(279); // KEYCODE_CLEAR
        } catch (e) {
            this.metadata.fallbackUsed = true;
            await this.driver.execute('mobile: shell', { command: 'input keyevent 279' });
        }
    }

    async hideKeyboard() {
        if (await this.driver.isKeyboardShown()) {
            await this.driver.hideKeyboard();
        }
    }

    async isKeyboardVisible() {
        return await this.driver.isKeyboardShown();
    }

    // ==========================================
    // DEEP LINKING (Fallback Cascade)
    // ==========================================

    async openDeepLink(uri, appPackage = 'ai.lekhan.app') {
        this._checkSupport('deepLinks');
        logger.info(`[AndroidAdapter] Opening Deep Link: ${uri}`);
        
        try {
            // Modern UiAutomator2 / Appium 2.x
            await this.driver.execute('mobile: deepLink', { url: uri, package: appPackage });
        } catch (e) {
            this.metadata.fallbackUsed = true;
            logger.warn(`[AndroidAdapter] mobile: deepLink failed. Falling back to ADB AM START...`);
            
            if (this.featureSupport.supports('adbShell')) {
                await this.driver.execute('mobile: shell', {
                    command: 'am start',
                    args: ['-W', '-a', 'android.intent.action.VIEW', '-d', uri, appPackage]
                });
            } else {
                throw new UnsupportedFeatureException(`Deep linking failed: ADB unsupported.`);
            }
        }
    }

    // ==========================================
    // NETWORK MANAGEMENT
    // ==========================================

    async toggleAirplaneMode() {
        this._checkSupport('networkControl');
        logger.info(`[AndroidAdapter] Toggling Airplane Mode (Connection Type 1)`);
        
        try {
            await this.driver.setNetworkConnection(1); // 1 = Airplane Mode
        } catch (e) {
            this.metadata.fallbackUsed = true;
            if (this.featureSupport.supports('adbShell')) {
                await this.driver.execute('mobile: shell', { command: 'cmd connectivity airplane-mode enable' });
            } else {
                throw new UnsupportedFeatureException(`Network control failed: ${e.message}`);
            }
        }
    }

    async enableNetwork() {
        this._checkSupport('networkControl');
        logger.info(`[AndroidAdapter] Enabling Network (Connection Type 6)`);
        
        try {
            await this.driver.setNetworkConnection(6); // 6 = All network on
        } catch (e) {
            this.metadata.fallbackUsed = true;
            if (this.featureSupport.supports('adbShell')) {
                await this.driver.execute('mobile: shell', { command: 'cmd connectivity airplane-mode disable' });
            } else {
                throw new UnsupportedFeatureException(`Network control failed: ${e.message}`);
            }
        }
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
        this._checkSupport('adbShell');
        logger.info(`[AndroidAdapter] Executing shell command: ${command}`);
        return await this.driver.execute('mobile: shell', { command });
    }

    // ==========================================
    // UTILS
    // ==========================================

    _checkSupport(feature) {
        if (!this.featureSupport.supports(feature)) {
            throw new UnsupportedFeatureException(`Feature '${feature}' is not supported on this Android Driver configuration.`);
        }
    }

    getMetadata() {
        return { ...this.metadata };
    }
}

import { VersionDetector } from './VersionDetector.js';
import { CapabilityDetector } from './CapabilityDetector.js';
import { FeatureSupport } from './FeatureSupport.js';
import { AndroidDriverAdapter } from './AndroidDriverAdapter.js';
import { IOSDriverAdapter } from './IOSDriverAdapter.js';
import { LoggerUtility as logger } from '../utilities/LoggerUtility.js';

export class CompatibilityManager {
    constructor(driver) {
        this.driver = driver;
        
        // 1. Detect Environment
        this.capabilities = new CapabilityDetector(driver);
        this.versions = new VersionDetector(driver);
        
        // 2. Evaluate Support Matrix
        this.featureSupport = new FeatureSupport(this.capabilities, this.versions);
        
        // 3. Delegate to appropriate Adapter
        this.adapter = null;
    }

    async initialize() {
        logger.info('[CompatibilityManager] Initializing Compatibility Layer...');
        await this.capabilities.detect();
        await this.versions.detect();
        await this.featureSupport.initialize();

        if (this.capabilities.isAndroid()) {
            logger.info('[CompatibilityManager] Loaded AndroidDriverAdapter');
            this.adapter = new AndroidDriverAdapter(this.driver, this.featureSupport);
        } else if (this.capabilities.isIOS()) {
            logger.info('[CompatibilityManager] Loaded IOSDriverAdapter');
            this.adapter = new IOSDriverAdapter(this.driver, this.featureSupport);
        } else {
            throw new Error('[CompatibilityManager] Unsupported or undetected platform capability.');
        }
    }

    // ==========================================
    // FACADE API DELEGATES
    // ==========================================

    async backgroundApp(seconds) {
        await this._ensureInit();
        const start = Date.now();
        await this.adapter.backgroundApp(seconds);
        this._logExecution('backgroundApp', start);
    }

    async terminate(bundleId) {
        await this._ensureInit();
        const start = Date.now();
        await this.adapter.terminate(bundleId);
        this._logExecution('terminate', start);
    }

    async activate(bundleId) {
        await this._ensureInit();
        const start = Date.now();
        await this.adapter.activate(bundleId);
        this._logExecution('activate', start);
    }

    async resetApp() {
        await this._ensureInit();
        const start = Date.now();
        await this.adapter.resetApp();
        this._logExecution('resetApp', start);
    }

    async installApp(appPath) {
        await this._ensureInit();
        const start = Date.now();
        await this.adapter.installApp(appPath);
        this._logExecution('installApp', start);
    }

    async removeApp(bundleId) {
        await this._ensureInit();
        const start = Date.now();
        await this.adapter.removeApp(bundleId);
        this._logExecution('removeApp', start);
    }

    async queryAppState(bundleId) {
        await this._ensureInit();
        const start = Date.now();
        const result = await this.adapter.queryAppState(bundleId);
        this._logExecution('queryAppState', start);
        return result;
    }

    async pressNext() {
        await this._ensureInit();
        const start = Date.now();
        await this.adapter.pressNext();
        this._logExecution('pressNext', start);
    }

    async pressClear() {
        await this._ensureInit();
        const start = Date.now();
        await this.adapter.pressClear();
        this._logExecution('pressClear', start);
    }

    async pressDone() {
        await this._ensureInit();
        const start = Date.now();
        await this.adapter.pressDone();
        this._logExecution('pressDone', start);
    }

    async hideKeyboard() {
        await this._ensureInit();
        const start = Date.now();
        await this.adapter.hideKeyboard();
        this._logExecution('hideKeyboard', start);
    }

    async isKeyboardVisible() {
        await this._ensureInit();
        const start = Date.now();
        const result = await this.adapter.isKeyboardVisible();
        this._logExecution('isKeyboardVisible', start);
        return result;
    }

    async performActions(actions) {
        await this._ensureInit();
        const start = Date.now();
        await this.adapter.performActions(actions);
        this._logExecution('performActions', start);
    }

    async setClipboard(content, contentType) {
        await this._ensureInit();
        const start = Date.now();
        await this.adapter.setClipboard(content, contentType);
        this._logExecution('setClipboard', start);
    }

    async back() {
        await this._ensureInit();
        const start = Date.now();
        await this.adapter.back();
        this._logExecution('back', start);
    }

    async pause(ms) {
        await this._ensureInit();
        const start = Date.now();
        await this.adapter.pause(ms);
        this._logExecution('pause', start);
    }

    async openDeepLink(uri, packageId = 'ai.lekhan.app') {
        await this._ensureInit();
        const start = Date.now();
        await this.adapter.openDeepLink(uri, packageId);
        this._logExecution('openDeepLink', start);
    }

    async toggleAirplaneMode() {
        await this._ensureInit();
        const start = Date.now();
        await this.adapter.toggleAirplaneMode();
        this._logExecution('toggleAirplaneMode', start);
    }

    async enableNetwork() {
        await this._ensureInit();
        const start = Date.now();
        await this.adapter.enableNetwork();
        this._logExecution('enableNetwork', start);
    }

    async rotateLandscape() {
        await this._ensureInit();
        const start = Date.now();
        await this.adapter.rotateLandscape();
        this._logExecution('rotateLandscape', start);
    }

    async rotatePortrait() {
        await this._ensureInit();
        const start = Date.now();
        await this.adapter.rotatePortrait();
        this._logExecution('rotatePortrait', start);
    }

    async currentOrientation() {
        await this._ensureInit();
        const start = Date.now();
        const result = await this.adapter.currentOrientation();
        this._logExecution('currentOrientation', start);
        return result;
    }

    async getWindowRect() {
        await this._ensureInit();
        const start = Date.now();
        const result = await this.adapter.getWindowRect();
        this._logExecution('getWindowRect', start);
        return result;
    }

    async executeShellCommand(command) {
        await this._ensureInit();
        const start = Date.now();
        const result = await this.adapter.executeShellCommand(command);
        this._logExecution('executeShellCommand', start);
        return result;
    }

    // ==========================================
    // UTILS
    // ==========================================

    async _ensureInit() {
        if (!this.adapter) {
            await this.initialize();
        }
    }

    _logExecution(method, startTime) {
        const duration = Date.now() - startTime;
        const meta = this.adapter.getMetadata();
        logger.info(`[CompatibilityManager] Executed ${method}() on ${this.capabilities.getPlatform()} in ${duration}ms (Fallback used: ${meta.fallbackUsed})`);
    }

    getCompatibilityMetadata() {
        return {
            platform: this.capabilities.getPlatform(),
            versions: this.versions.getDetectedVersions(),
            adapterMeta: this.adapter ? this.adapter.getMetadata() : null
        };
    }
}

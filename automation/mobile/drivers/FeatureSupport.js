import { LoggerUtility as logger } from '../utilities/LoggerUtility.js';

export class FeatureSupport {
    constructor(capabilityDetector, versionDetector) {
        this.capabilities = capabilityDetector;
        this.versions = versionDetector.getDetectedVersions();
        
        this.features = {
            deepLinks: false,
            backgroundApp: false,
            keyEvents: false,
            networkControl: false,
            screenRotation: false,
            clipboard: false,
            appState: false,
            biometrics: false,
            adbShell: false
        };
    }

    async initialize() {
        logger.info('[FeatureSupport] Evaluating feature matrix based on driver/OS profile...');
        
        const isAndroid = this.capabilities.isAndroid();
        const isIOS = this.capabilities.isIOS();
        const isUiAutomator2 = this.capabilities.isUiAutomator2();
        
        // Base Matrix
        this.features.screenRotation = true;
        this.features.appState = true;
        
        if (isAndroid) {
            this.features.deepLinks = true; // supported via mobile: deepLink or ADB
            this.features.keyEvents = true; // supported via pressKeyCode
            this.features.clipboard = true;
            this.features.backgroundApp = true;
            
            if (isUiAutomator2) {
                this.features.networkControl = true; 
                this.features.adbShell = true; // UiAutomator2 natively binds adb
            }
        }

        if (isIOS) {
            this.features.deepLinks = true; // supported via Safari or xcrun simctl
            this.features.backgroundApp = true;
            this.features.keyEvents = false; // XCUITest does not support arbitrary Android keycodes
            this.features.networkControl = false; // Usually requires system-level proxy/mocking on iOS
            this.features.adbShell = false; 
        }

        logger.info(`[FeatureSupport] Matrix Resolved: DeepLinks=${this.features.deepLinks}, ADB=${this.features.adbShell}`);
    }

    supports(featureName) {
        return !!this.features[featureName];
    }
}

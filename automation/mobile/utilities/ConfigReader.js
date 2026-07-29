import fs from 'fs';
import path from 'path';
import { logger } from './LoggerUtility.js';

export class ConfigReader {
    static getConfig() {
        try {
            const configPath = path.resolve(process.cwd(), 'config/config.json');
            if (fs.existsSync(configPath)) {
                return JSON.parse(fs.readFileSync(configPath, 'utf8'));
            }
            logger.warn('config.json not found, using default configuration.');
            return {
                platform: 'Android',
                deviceName: 'emulator-5554',
                automationName: 'UiAutomator2',
                headless: false
            };
        } catch (error) {
            logger.error(`Error reading config: ${error.message}`);
            throw error;
        }
    }

    static getCapabilities() {
        const config = this.getConfig();
        const capabilities = {
            'platformName': config.platform,
            'appium:deviceName': config.deviceName,
            'appium:automationName': config.automationName,
            'appium:app': path.resolve(process.cwd(), `apk/${config.appName}`),
            'appium:noReset': false,
            'appium:newCommandTimeout': 240,
        };

        if (config.platformVersion) {
            capabilities['appium:platformVersion'] = config.platformVersion;
        }

        if (config.headless && !config.isRealDevice) {
            capabilities['appium:isHeadless'] = true;
        }

        return capabilities;
    }
}

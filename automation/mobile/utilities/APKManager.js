import { CompatibilityManager } from '../drivers/CompatibilityManager.js';
import path from 'path';
import { logger } from './LoggerUtility.js';
import { ConfigReader } from './ConfigReader.js';
import { APKValidator } from './APKValidator.js';
import { APKMetadata } from './APKMetadata.js';

export class APKManager {
    static getAPKPath(environment) {
        const config = ConfigReader.getConfig();
        const apkConfig = config.apk || {};
        
        if (!apkConfig[environment]) {
            throw new Error(`APK path for environment '${environment}' is not defined in config.json`);
        }
        
        // Resolve relative to project root (where config is usually read)
        return path.resolve(process.cwd(), apkConfig[environment]);
    }

    static findLatestAPK() {
        logger.info('Searching APK...');
        const config = ConfigReader.getConfig();
        const env = config.environment || 'qa';
        const apkPath = this.getAPKPath(env);
        
        logger.info(`APK Found for environment '${env}': ${apkPath}`);
        return apkPath;
    }

    static async isInstalled(driver, packageName) {
        try {
            return await driver.isAppInstalled(packageName);
        } catch (error) {
            logger.warn(`Failed to check installation status: ${error.message}`);
            return false;
        }
    }

    static async getInstalledVersion(driver, packageName) {
        try {
            // WebdriverIO doesn't have a native getAppVersion for Android in all clients, fallback to ADB
            const output = await compatibilityManager.executeShellCommand('dumpsys',
                args: ['package', packageName]
            );
            const match = output.match(/versionName=([^\\s]+)/);
            return match ? match[1] : null;
        } catch (error) {
            logger.warn(`Failed to retrieve installed version: ${error.message}`);
            return null;
        }
    }

    static async installAPK(driver) {
        const config = ConfigReader.getConfig();
        const env = config.environment || 'qa';
        const apkPath = this.findLatestAPK();

        const validation = APKValidator.validateAPK(apkPath, env);
        if (!validation.isValid) {
            throw new Error(`APK Validation Failed: ${validation.message}`);
        }

        const metadata = APKMetadata.extractMetadata(apkPath);
        const packageName = metadata.packageName;

        if (packageName === 'Unknown') {
            logger.warn('Package name could not be determined. Proceeding with blind installation.');
            logger.info('Installing APK...');
            await compatibilityManager.installApp(apkPath);
            logger.info('Installation Completed');
            return metadata;
        }

        const isAppInstalled = await this.isInstalled(driver, packageName);
        
        if (isAppInstalled) {
            const installedVersion = await this.getInstalledVersion(driver, packageName);
            if (installedVersion === metadata.versionName) {
                logger.info(`App ${packageName} v${metadata.versionName} is already installed. Skipping installation.`);
                return metadata;
            } else {
                logger.info(`Version mismatch (Installed: ${installedVersion}, New: ${metadata.versionName}). Uninstalling old version...`);
                await this.uninstallAPK(driver, packageName);
            }
        }

        logger.info('Installing APK...');
        await compatibilityManager.installApp(apkPath);
        
        const verifyInstall = await this.isInstalled(driver, packageName);
        if (!verifyInstall) {
            throw new Error('Installation verification failed.');
        }

        logger.info('Installation Completed');
        return metadata;
    }

    static async uninstallAPK(driver, packageName) {
        logger.info(`Uninstalling app: ${packageName}`);
        try {
            await compatibilityManager.removeApp(packageName);
        } catch (error) {
            logger.error(`Uninstall failed: ${error.message}`);
        }
    }

    static async reinstallAPK(driver) {
        logger.info('Reinstalling APK flow initiated...');
        const apkPath = this.findLatestAPK();
        const metadata = APKMetadata.extractMetadata(apkPath);
        
        if (metadata.packageName !== 'Unknown') {
            await this.uninstallAPK(driver, metadata.packageName);
        }
        await this.installAPK(driver);
    }

    static async launchApp(driver, packageName) {
        logger.info('Launching Application...');
        try {
            await compatibilityManager.activate(packageName);
            logger.info('Application Started');
        } catch (error) {
            logger.error(`Failed to launch application: ${error.message}`);
        }
    }

    static async terminateApp(driver, packageName) {
        logger.info(`Terminating Application: ${packageName}`);
        try {
            await compatibilityManager.terminate(packageName);
        } catch (error) {
            logger.error(`Failed to terminate application: ${error.message}`);
        }
    }

    static async clearAppData(driver, packageName) {
        logger.info(`Clearing App Data for: ${packageName}`);
        try {
            await driver.clearApp(packageName);
        } catch (error) {
            logger.error(`Failed to clear app data: ${error.message}`);
        }
    }

    static async resetApplication(driver, packageName) {
        logger.info(`Resetting Application: ${packageName}`);
        await this.clearAppData(driver, packageName);
        await this.launchApp(driver, packageName);
    }
}

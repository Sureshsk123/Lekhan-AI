import { remote } from 'webdriverio';
import { logger } from '../utilities/LoggerUtility.js';
import { ConfigReader } from '../utilities/ConfigReader.js';

export class DriverManager {
    static driver = null;

    static async getDriver() {
        if (!this.driver) {
            logger.info('Initializing WebdriverIO session...');
            const config = ConfigReader.getConfig();
            const capabilities = ConfigReader.getCapabilities();

            const wdioOptions = {
                path: '/',
                port: config.appiumPort || 4723,
                capabilities: capabilities,
                logLevel: 'error'
            };

            try {
                this.driver = await remote(wdioOptions);
                logger.info('WebdriverIO session initialized successfully.');
            } catch (error) {
                logger.error(`Failed to initialize WebdriverIO session: ${error.message}`);
                throw error;
            }
        }
        return this.driver;
    }

    static async quitDriver() {
        if (this.driver) {
            logger.info('Deleting WebdriverIO session...');
            try {
                await this.driver.deleteSession();
            } catch (error) {
                logger.warn(`Error while deleting session: ${error.message}`);
            } finally {
                this.driver = null;
            }
        }
    }
}

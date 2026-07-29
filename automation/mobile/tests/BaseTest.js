import { AppiumServerManager } from '../utilities/AppiumServerManager.js';
import { DeviceManager } from '../utilities/DeviceManager.js';
import { DriverManager } from '../drivers/DriverManager.js';
import { ScreenshotUtility } from '../utilities/ScreenshotUtility.js';
import { logger } from '../utilities/LoggerUtility.js';

export class BaseTest {
    static setupHooks() {
        before(async function () {
            this.timeout(120000); // 2 minutes for initial boot
            logger.info('--- Global Pre-Test Setup ---');
            
            try {
                await AppiumServerManager.startServer();
                await DeviceManager.startEmulator();
            } catch (error) {
                logger.error(`Failed during pre-test setup: ${error.message}`);
                throw error;
            }
        });

        beforeEach(async function () {
            logger.info(`--- Starting Test: ${this.currentTest.title} ---`);
            try {
                this.driver = await DriverManager.getDriver();
            } catch (error) {
                logger.error(`Failed to initialize driver for test: ${error.message}`);
                throw error;
            }
        });

        afterEach(async function () {
            if (this.currentTest.state === 'failed') {
                logger.error(`Test Failed: ${this.currentTest.title}`);
                if (this.driver) {
                    await ScreenshotUtility.captureScreenshot(this.driver, this.currentTest.title);
                }
            } else {
                logger.info(`Test Passed: ${this.currentTest.title}`);
            }

            try {
                await DriverManager.quitDriver();
            } catch (error) {
                logger.error(`Error tearing down driver: ${error.message}`);
            }
        });

        after(async function () {
            logger.info('--- Global Post-Test Teardown ---');
            try {
                await AppiumServerManager.stopServer();
            } catch (error) {
                logger.error(`Failed to stop Appium server: ${error.message}`);
            }
        });
    }
}

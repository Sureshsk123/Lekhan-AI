import { BrowserManager } from '../utilities/BrowserManager.js';
import { ScreenshotUtility } from '../utilities/ScreenshotUtility.js';
import { logger } from '../utilities/LoggerUtility.js';
import { envManager } from '../utilities/EnvironmentManager.js';

export class BaseTest {
    static setupHooks() {
        before(async function () {
            logger.info(`--- Starting Test Suite: ${this.test?.parent?.title || 'Suite'} ---`);
            this.driver = await BrowserManager.getDriver();
            await BrowserManager.navigateTo(envManager.getBaseUrl());
        });

        beforeEach(async function () {
            logger.info(`--- Starting Test: ${this.currentTest.title} ---`);
        });

        afterEach(async function () {
            if (this.currentTest.state === 'failed') {
                logger.error(`Test Failed: ${this.currentTest.title}`);
                logger.error(`Error Stack: ${this.currentTest.err.stack}`);
                
                try {
                    const currentUrl = await this.driver.getCurrentUrl();
                    logger.error(`Failed at URL: ${currentUrl}`);
                    
                    const logs = await this.driver.manage().logs().get('browser');
                    if (logs && logs.length > 0) {
                        logger.error('Browser Console Logs:');
                        logs.forEach(log => logger.error(`[${log.level.name}] ${log.message}`));
                    }
                } catch (e) {
                    logger.error(`Failed to capture browser state: ${e.message}`);
                }

                await ScreenshotUtility.captureScreenshot(this.driver, this.currentTest.title);
            } else {
                logger.info(`Test Passed: ${this.currentTest.title}`);
            }
        });

        after(async function () {
            logger.info('--- Tearing down Test Suite ---');
            await BrowserManager.quitDriver();
        });
    }
}

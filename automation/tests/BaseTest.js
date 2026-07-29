import { BrowserManager } from '../utilities/BrowserManager.js';
import { ScreenshotUtility } from '../utilities/ScreenshotUtility.js';
import { logger } from '../utilities/LoggerUtility.js';
import { envManager } from '../utilities/EnvironmentManager.js';
import { MochawesomeManager } from '../utilities/MochawesomeManager.js';
import fs from 'fs';
import path from 'path';

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
            let retryHistory = "No Retry Required";
            let retryCount = 0;
            try {
                const browserStr = envManager.getBrowser().toLowerCase();
                const workerId = process.env.MOCHA_WORKER_ID || '0';
                const logPath = path.resolve(process.cwd(), `logs/${browserStr}/automation-worker-${workerId}.log`);
                if (fs.existsSync(logPath)) {
                    const logContent = fs.readFileSync(logPath, 'utf8');
                    const testStartMarker = `--- Starting Test: ${this.currentTest.title} ---`;
                    const parts = logContent.split(testStartMarker);
                    if (parts.length > 1) {
                        const testLogs = parts.pop();
                        const retryMatches = [...testLogs.matchAll(/Action failed on attempt (\d+)\/(\d+)/g)];
                        if (retryMatches.length > 0) {
                            retryCount = retryMatches.length;
                            retryHistory = retryMatches.map(m => `Attempt ${m[1]} ❌ Failed`).join('\n');
                            if (this.currentTest.state === 'passed') {
                                retryHistory += `\nAttempt ${parseInt(retryMatches[retryMatches.length-1][1]) + 1} ✅ Passed\nRetry Count: ${retryCount}`;
                            } else {
                                retryHistory += `\nFinal Status ❌ Failed\nRetry Count: ${retryCount}`;
                            }
                        }
                    }
                }
            } catch (e) {
                logger.error(`Failed to parse retry history: ${e.message}`);
            }

            const pkgPath = path.resolve(process.cwd(), 'package.json');
            const pkg = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, 'utf8')) : {};
            const seleniumVersion = (pkg.dependencies && pkg.dependencies['selenium-webdriver']) || 'Unknown';
            let browserVersion = 'Unknown';
            if (this.driver) {
                try {
                    const caps = await this.driver.getCapabilities();
                    browserVersion = caps.getBrowserVersion() || caps.get('version') || 'Unknown';
                } catch(e) {}
            }
            const workerId = process.env.MOCHA_WORKER_ID || '0';

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

                try {
                    let base64Image = null;
                    if (this.driver) {
                        base64Image = await this.driver.takeScreenshot();
                    }
                    
                    const screenshotPath = await ScreenshotUtility.captureScreenshot(this.driver, this.currentTest.title);
                    
                    const logs = await this.driver.manage().logs().get('browser').catch(() => []);
                    const currentUrl = await this.driver.getCurrentUrl().catch(() => 'Unknown');

                    await MochawesomeManager.addTestContext(this, {
                        currentUrl,
                        logs,
                        base64Image,
                        screenshotPath,
                        retryHistory,
                        retryCount,
                        seleniumVersion,
                        browserVersion,
                        workerId,
                        failureTimestamp: new Date().toISOString()
                    });
                } catch (e) {
                    logger.error(`Error adding Mochawesome context: ${e.message}`);
                }
                
            } else {
                logger.info(`Test Passed: ${this.currentTest.title}`);
                await MochawesomeManager.addTestContext(this, {
                    retryHistory,
                    retryCount,
                    seleniumVersion,
                    browserVersion,
                    workerId
                });
            }
        });

        after(async function () {
            logger.info('--- Tearing down Test Suite ---');
            try {
                await BrowserManager.quitDriver();
            } catch (error) {
                logger.error(`Error during driver teardown: ${error.message}`);
            }
        });
    }
}

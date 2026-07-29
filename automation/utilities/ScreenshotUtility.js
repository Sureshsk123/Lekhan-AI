import fs from 'fs';
import path from 'path';
import { logger } from './LoggerUtility.js';
import { CONSTANTS } from './Constants.js';
import { envManager } from './EnvironmentManager.js';

export class ScreenshotUtility {
    static async captureScreenshot(driver, testName) {
        try {
            const image = await driver.takeScreenshot();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const workerId = process.env.MOCHA_WORKER_ID || '0';
            const browser = envManager.getBrowser().toLowerCase();
            const fileName = `${testName.replace(/\s+/g, '_')}_worker-${workerId}_${timestamp}.png`;
            
            const screenshotDir = path.join(CONSTANTS.PATHS.SCREENSHOTS, browser);
            
            if (!fs.existsSync(screenshotDir)) {
                fs.mkdirSync(screenshotDir, { recursive: true });
            }
            
            const filePath = path.join(screenshotDir, fileName);
            fs.writeFileSync(filePath, image, 'base64');
            logger.info(`Screenshot captured: ${filePath}`);
            return filePath;
        } catch (error) {
            logger.error(`Failed to capture screenshot: ${error.message}`);
        }
    }
}

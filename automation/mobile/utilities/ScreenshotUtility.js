import fs from 'fs';
import path from 'path';
import { logger } from './LoggerUtility.js';

export class ScreenshotUtility {
    static async captureScreenshot(driver, testName) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const sanitizedName = testName.replace(/[^a-zA-Z0-9]/g, '_');
            const fileName = `${sanitizedName}_${timestamp}.png`;
            const screenshotsDir = path.resolve(process.cwd(), 'screenshots');

            if (!fs.existsSync(screenshotsDir)) {
                fs.mkdirSync(screenshotsDir, { recursive: true });
            }

            const filePath = path.join(screenshotsDir, fileName);
            await driver.saveScreenshot(filePath);
            logger.info(`Screenshot saved: ${filePath}`);
            
            // Return relative path for reporting
            return `../../screenshots/${fileName}`;
        } catch (error) {
            logger.error(`Failed to capture screenshot: ${error.message}`);
            return null;
        }
    }
}

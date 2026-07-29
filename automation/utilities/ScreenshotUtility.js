import fs from 'fs';
import path from 'path';
import { logger } from './LoggerUtility.js';
import { CONSTANTS } from './Constants.js';

export class ScreenshotUtility {
    static async captureScreenshot(driver, testName) {
        try {
            const image = await driver.takeScreenshot();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `${testName.replace(/\s+/g, '_')}_${timestamp}.png`;
            const filePath = path.join(CONSTANTS.PATHS.SCREENSHOTS, fileName);
            
            if (!fs.existsSync(CONSTANTS.PATHS.SCREENSHOTS)) {
                fs.mkdirSync(CONSTANTS.PATHS.SCREENSHOTS, { recursive: true });
            }
            
            fs.writeFileSync(filePath, image, 'base64');
            logger.info(`Screenshot captured: ${filePath}`);
            return filePath;
        } catch (error) {
            logger.error(`Failed to capture screenshot: ${error.message}`);
        }
    }
}

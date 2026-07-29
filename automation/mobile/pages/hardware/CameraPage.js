import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';
import { WaitUtility } from '../../utilities/WaitUtility.js';

export class CameraPage extends BasePage {
    constructor(driver) {
        super(driver);
        // Using native camera selectors commonly found across Android builds
        this.selectors = {
            shutterButton: 'id=com.android.camera2:id/shutter_button',
            confirmImageButton: 'id=com.android.camera2:id/done_button',
            flashToggle: 'id=com.android.camera2:id/flash_toggle'
        };
    }

    async captureImage() {
        logger.info('Attempting to capture image via native camera');
        await this.clickElement(this.selectors.shutterButton);
        // Pause briefly to allow camera hardware to process capture
        await this.driver.pause(2000); 
    }

    async confirmCapture() {
        logger.info('Confirming captured image');
        await this.clickElement(this.selectors.confirmImageButton);
    }
}

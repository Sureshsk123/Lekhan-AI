import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';
import { PermissionDialog } from '../common/PermissionDialog.js';

export class OCRPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.permissionDialog = new PermissionDialog(driver);
        this.selectors = {
            openCameraButton: '~btn_open_camera',
            openGalleryButton: '~btn_open_gallery',
            processDocumentButton: '~btn_process_ocr',
            ocrResultText: '~txt_ocr_result'
        };
    }

    async triggerCamera() {
        logger.info('Triggering camera from OCR screen');
        await this.clickElement(this.selectors.openCameraButton);
    }

    async triggerGallery() {
        logger.info('Triggering gallery from OCR screen');
        await this.clickElement(this.selectors.openGalleryButton);
    }

    async processDocument() {
        logger.info('Processing document via OCR');
        await this.clickElement(this.selectors.processDocumentButton);
    }

    async getOCRResults() {
        return await this.getText(this.selectors.ocrResultText);
    }
}

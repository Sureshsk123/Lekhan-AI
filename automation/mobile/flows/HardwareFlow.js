import { OCRPage } from '../pages/hardware/OCRPage.js';
import { CameraPage } from '../pages/hardware/CameraPage.js';
import { GalleryPage } from '../pages/hardware/GalleryPage.js';
import { PermissionDialog } from '../pages/common/PermissionDialog.js';
import { LoggerUtility as logger } from '../utilities/LoggerUtility.js';
import { RetryUtility } from '../utilities/RetryUtility.js';
import { ScreenshotUtility } from '../utilities/ScreenshotUtility.js';

export class HardwareFlow {
    constructor(driver, navManager, context) {
        this.driver = driver;
        this.navManager = navManager;
        this.context = context;

        this.ocrPage = new OCRPage(driver);
        this.cameraPage = new CameraPage(driver);
        this.galleryPage = new GalleryPage(driver);
        this.permissionDialog = new PermissionDialog(driver);
    }

    async grantCameraPermission() {
        logger.info('[Flow] Attempting to grant Camera permission');
        try {
            await this.permissionDialog.grantPermission();
        } catch (e) {
            logger.warn('[Flow] Camera permission dialog not found or already granted');
        }
    }

    async grantStoragePermission() {
        logger.info('[Flow] Attempting to grant Storage permission');
        try {
            await this.permissionDialog.grantPermission();
        } catch (e) {
            logger.warn('[Flow] Storage permission dialog not found or already granted');
        }
    }

    async captureImage() {
        this.context.startFlow('HardwareFlow.captureImage');
        logger.info('[Flow] Executing image capture flow via Camera');

        try {
            await this.grantCameraPermission();
            await RetryUtility.retry(async () => {
                await this.cameraPage.captureImage();
                await this.cameraPage.confirmCapture();
            }, 2, 2000);
            
            this.context.completeFlow('HardwareFlow.captureImage');
        } catch (error) {
            await ScreenshotUtility.captureFailure(this.driver, 'Flow_CaptureImage_Failed');
            logger.error(`[Flow] Image capture failed: ${error.message}`);
            throw new Error(`HardwareFlow.captureImage failed: ${error.message}`);
        }
    }

    async selectGalleryImage() {
        this.context.startFlow('HardwareFlow.selectGalleryImage');
        logger.info('[Flow] Executing image selection flow via Gallery');

        try {
            await this.grantStoragePermission();
            await RetryUtility.retry(async () => {
                await this.galleryPage.selectGalleryImage(0); // Select first image
            }, 2, 2000);

            this.context.completeFlow('HardwareFlow.selectGalleryImage');
        } catch (error) {
            await ScreenshotUtility.captureFailure(this.driver, 'Flow_SelectGalleryImage_Failed');
            logger.error(`[Flow] Gallery selection failed: ${error.message}`);
            throw new Error(`HardwareFlow.selectGalleryImage failed: ${error.message}`);
        }
    }

    async processOCRDocument(imageSource = 'gallery') {
        this.context.startFlow('HardwareFlow.processOCRDocument');
        logger.info(`[Flow] Processing OCR document via: ${imageSource}`);

        try {
            await this.navManager.gotoOCR();

            if (imageSource === 'camera') {
                await this.ocrPage.triggerCamera();
                await this.captureImage();
            } else {
                await this.ocrPage.triggerGallery();
                await this.selectGalleryImage();
            }

            // Wait for processing to complete
            await RetryUtility.retry(async () => {
                await this.ocrPage.processDocument();
                const result = await this.ocrPage.getOCRResults();
                if (!result || result.trim() === '') {
                    throw new Error('OCR returned empty string');
                }
            }, 2, 3000);

            this.context.completeFlow('HardwareFlow.processOCRDocument');
            logger.info('[Flow] OCR Document processed successfully');
        } catch (error) {
            await ScreenshotUtility.captureFailure(this.driver, 'Flow_ProcessOCR_Failed');
            logger.error(`[Flow] OCR processing failed: ${error.message}`);
            throw new Error(`HardwareFlow.processOCRDocument failed: ${error.message}`);
        }
    }
}

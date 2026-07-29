import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';

export class GalleryPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            photoGrid: 'id=com.google.android.documentsui:id/dir_list',
            photoItemPrefix: 'android=new UiSelector().resourceId("com.google.android.documentsui:id/icon_mime").instance('
        };
    }

    async selectGalleryImage(index = 0) {
        logger.info(`Selecting gallery image at index: ${index}`);
        const selector = `${this.selectors.photoItemPrefix}${index})`;
        await this.clickElement(selector);
    }
}

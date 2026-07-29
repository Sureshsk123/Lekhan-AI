import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';

export class OcrPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = {
            fileInput: By.css('input[type="file"]'),
            scanButton: By.css('button:contains("Scan"), .scan-btn, button:contains("Upload")'),
            resultText: By.css('.ocr-result, .extracted-text, pre')
        };
    }

    async uploadImage(filePath) {
        await this.actions.uploadFile(this.locators.fileInput, filePath);
    }

    async triggerScan() {
        await this.actions.click(this.locators.scanButton);
    }

    async getExtractedText() {
        return await this.actions.getText(this.locators.resultText);
    }
}

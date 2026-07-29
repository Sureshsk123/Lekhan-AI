import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';

export class SearchComponents extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = {
            searchInput: By.css('input[type="search"], input[placeholder*="Search"]'),
            searchButton: By.css('button[type="submit"], button[aria-label="Search"]')
        };
    }

    async searchFor(query) {
        await this.actions.type(this.locators.searchInput, query);
        if (await this.actions.isDisplayed(this.locators.searchButton)) {
            await this.actions.click(this.locators.searchButton);
        } else {
            // Send enter key if button is not present
            const inputElement = await this.actions.waitForVisible(this.locators.searchInput);
            await inputElement.sendKeys('\\n');
        }
    }
}

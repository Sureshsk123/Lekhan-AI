import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';

export class Sidebar extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = {
            sidebarContainer: By.css('aside'),
            linkByText: (text) => By.xpath(`//aside//a[contains(text(), '${text}')] | //aside//span[contains(text(), '${text}')]`)
        };
    }

    async clickMenuItem(menuText) {
        await this.actions.click(this.locators.linkByText(menuText));
    }

    async isMenuVisible(menuText) {
        return await this.actions.isDisplayed(this.locators.linkByText(menuText));
    }
}

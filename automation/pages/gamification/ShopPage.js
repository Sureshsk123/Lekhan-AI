import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';

export class ShopPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = {
            itemCard: By.css('.shop-item, .item-card'),
            buyButtonByItemName: (name) => By.xpath(`//div[contains(@class, 'item-card')][.//h3[contains(text(), '${name}')]]//button[contains(text(), 'Buy')]`),
            xpBalance: By.css('.xp-balance, .currency')
        };
    }

    async getXpBalance() {
        return await this.actions.getText(this.locators.xpBalance);
    }

    async buyItem(itemName) {
        await this.actions.click(this.locators.buyButtonByItemName(itemName));
    }
}

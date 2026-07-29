import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';

export class InventoryPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = {
            itemCard: By.css('.inventory-item, .item-card'),
            equipButtonByItemName: (name) => By.xpath(`//div[contains(@class, 'item-card')][.//h3[contains(text(), '${name}')]]//button[contains(text(), 'Equip')]`),
            equippedStatus: (name) => By.xpath(`//div[contains(@class, 'item-card')][.//h3[contains(text(), '${name}')]]//*[contains(text(), 'Equipped')]`)
        };
    }

    async equipItem(itemName) {
        await this.actions.click(this.locators.equipButtonByItemName(itemName));
    }

    async isItemEquipped(itemName) {
        return await this.actions.isDisplayed(this.locators.equippedStatus(itemName));
    }
}

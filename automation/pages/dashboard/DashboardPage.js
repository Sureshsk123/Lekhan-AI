import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';

export class DashboardPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = {
            welcomeMessage: By.css('.welcome-message, h1'),
            widgetByTitle: (title) => By.xpath(`//div[contains(@class, 'widget')]//h2[contains(text(), '${title}')]`),
            actionButton: (text) => By.xpath(`//button[contains(text(), '${text}')] | //a[contains(text(), '${text}')]`)
        };
    }

    async getWelcomeMessage() {
        return await this.actions.getText(this.locators.welcomeMessage);
    }

    async isWidgetDisplayed(title) {
        return await this.actions.isDisplayed(this.locators.widgetByTitle(title));
    }

    async clickActionButton(text) {
        await this.actions.click(this.locators.actionButton(text));
    }
}

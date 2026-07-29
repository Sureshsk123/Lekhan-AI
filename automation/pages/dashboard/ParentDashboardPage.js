import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';
import { CommonForms } from '../components/CommonForms.js';
import { Tables } from '../components/Tables.js';

export class ParentDashboardPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.forms = new CommonForms(driver);
        this.tables = new Tables(driver);
        this.locators = {
            linkChildButton: By.css('button:contains("Link Child"), .link-child-btn'),
            childCodeInput: By.css('input[name="childCode"], input[placeholder*="Child Code"]'),
            submitLinkButton: By.css('button.submit-link, form button[type="submit"]')
        };
    }

    async openLinkChildForm() {
        await this.actions.click(this.locators.linkChildButton);
    }

    async linkChild(code) {
        await this.actions.type(this.locators.childCodeInput, code);
        await this.actions.click(this.locators.submitLinkButton);
    }

    async getChildStatsRow(rowIndex) {
        return await this.tables.getCellText(rowIndex, 1);
    }
}

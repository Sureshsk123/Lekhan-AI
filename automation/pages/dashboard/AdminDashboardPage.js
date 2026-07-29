import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';
import { Tables } from '../components/Tables.js';

export class AdminDashboardPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.tables = new Tables(driver);
        this.locators = {
            systemStatsCard: By.css('.stats-card'),
            manageUsersTab: By.css('button:contains("Users"), a:contains("Users")'),
            settingsTab: By.css('button:contains("Settings"), a:contains("Settings")')
        };
    }

    async getSystemStat(statName) {
        const locator = By.xpath(`//div[contains(@class, 'stats-card')]//div[contains(text(), '${statName}')]/following-sibling::div`);
        return await this.actions.getText(locator);
    }

    async goToManageUsers() {
        await this.actions.click(this.locators.manageUsersTab);
    }

    async getTableData(rowIndex, colIndex) {
        return await this.tables.getCellText(rowIndex, colIndex);
    }
}

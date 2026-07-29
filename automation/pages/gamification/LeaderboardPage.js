import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';
import { Tables } from '../components/Tables.js';

export class LeaderboardPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.tables = new Tables(driver);
        this.locators = {
            globalTab: By.css('button:contains("Global"), .tab-global'),
            friendsTab: By.css('button:contains("Friends"), .tab-friends')
        };
    }

    async switchToGlobalTab() {
        await this.actions.click(this.locators.globalTab);
    }

    async switchToFriendsTab() {
        await this.actions.click(this.locators.friendsTab);
    }

    async getRankDetails(rowIndex) {
        const rank = await this.tables.getCellText(rowIndex, 1);
        const name = await this.tables.getCellText(rowIndex, 2);
        const xp = await this.tables.getCellText(rowIndex, 3);
        return { rank, name, xp };
    }
}

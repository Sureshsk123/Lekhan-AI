import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';
import { CommonForms } from '../components/CommonForms.js';

export class SettingsPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.forms = new CommonForms(driver);
        this.locators = {
            themeToggle: By.css('.theme-toggle, input[type="checkbox"][name="theme"]'),
            saveProfileButton: By.css('button:contains("Save Profile"), form button[type="submit"]')
        };
    }

    async toggleTheme() {
        await this.actions.click(this.locators.themeToggle);
    }

    async updateProfileName(newName) {
        await this.forms.fillInputByName('name', newName);
        await this.actions.click(this.locators.saveProfileButton);
    }
}

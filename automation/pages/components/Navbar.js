import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';

export class Navbar extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = {
            navContainer: By.css('nav'),
            homeLink: By.css('nav a[href="/"]'),
            dashboardLink: By.css('nav a[href="/dashboard"]'),
            userMenu: By.css('nav .user-menu, nav [aria-label="User menu"]'),
            logoutButton: By.css('nav button:contains("Logout"), nav .logout-btn')
        };
    }

    async goHome() {
        await this.actions.click(this.locators.homeLink);
    }

    async goToDashboard() {
        await this.actions.click(this.locators.dashboardLink);
    }

    async openUserMenu() {
        await this.actions.click(this.locators.userMenu);
    }

    async logout() {
        await this.openUserMenu();
        await this.actions.click(this.locators.logoutButton);
    }
}

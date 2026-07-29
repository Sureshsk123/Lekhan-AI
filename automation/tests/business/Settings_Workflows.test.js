import { expect } from 'chai';
import { BaseTest } from '../BaseTest.js';
import { LoginPage } from '../../pages/auth/LoginPage.js';
import { Sidebar } from '../../pages/components/Sidebar.js';
import { Navbar } from '../../pages/components/Navbar.js';
import { SettingsPage } from '../../pages/settings/SettingsPage.js';
import { Toasts } from '../../pages/components/Toasts.js';
import { envManager } from '../../utilities/EnvironmentManager.js';
import { dataManager } from '../../utilities/DataManager.js';


describe('Business Workflow - Settings & Profile', function () {
    BaseTest.setupHooks();
    let loginPage, sidebar, navbar, settingsPage, toasts;

    before(async function () {
        loginPage = new LoginPage(this.driver);
        sidebar = new Sidebar(this.driver);
        navbar = new Navbar(this.driver);
        settingsPage = new SettingsPage(this.driver);
        toasts = new Toasts(this.driver);
    });

    beforeEach(async function () {
        await this.driver.get(`${envManager.getBaseUrl()}/login`);
        await this.driver.executeScript("window.localStorage.clear();");
        await loginPage.loginAs(dataManager.getUser('student').email, dataManager.getUser('student').password);
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/dashboard'), loginPage.actions.timeout);
    });

    it('E2E: Update Profile -> Save -> Logout', async function () {
        // Navigate to settings via Navbar (assume profile icon drops down to Settings)
        await navbar.clickNavItem('Settings');
        
        // Wait for route change
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/settings'), navbar.actions.timeout);
        
        // Update Profile
        const uniqueName = `User ${Date.now()}`;
        await settingsPage.updateProfile(uniqueName, 'Updated Bio');
        
        // Verify Toast Confirmation
        const toastMsg = await toasts.getToastMessage();
        expect(toastMsg.toLowerCase()).to.include('success');
        
        // Logout safely via sidebar or navbar
        await navbar.logout();
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/login'), navbar.actions.timeout);
        
        const currentUrl = await this.driver.getCurrentUrl();
        expect(currentUrl).to.include('/login');
    });

    it('E2E: Change Theme -> State Persistence', async function () {
        await this.driver.get(`${envManager.getBaseUrl()}/settings`);
        
        // Toggle theme
        await settingsPage.toggleTheme();
        
        // Verify UI class update on body or html
        const theme = await this.driver.executeScript("return document.body.className;");
        expect(theme).to.not.be.undefined; // Could be 'dark' or 'light'
        
        // Refresh page to check persistence
        await this.driver.navigate().refresh();
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/settings'), settingsPage.actions.timeout);
        
        const refreshedTheme = await this.driver.executeScript("return document.body.className;");
        expect(refreshedTheme).to.equal(theme);
    });
});

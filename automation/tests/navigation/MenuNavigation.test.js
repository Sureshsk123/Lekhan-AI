import { expect } from 'chai';
import { BaseTest } from '../BaseTest.js';
import { Navbar } from '../../pages/components/Navbar.js';
import { Sidebar } from '../../pages/components/Sidebar.js';
import { DashboardPage } from '../../pages/dashboard/DashboardPage.js';
import { LoginPage } from '../../pages/auth/LoginPage.js';
import { envManager } from '../../utilities/EnvironmentManager.js';
import { dataManager } from '../../utilities/DataManager.js';


describe('Menu Navigation Tests', function () {
    BaseTest.setupHooks();
    let navbar;
    let sidebar;
    let dashboardPage;
    let loginPage;

    before(async function () {
        navbar = new Navbar(this.driver);
        sidebar = new Sidebar(this.driver);
        dashboardPage = new DashboardPage(this.driver);
        loginPage = new LoginPage(this.driver);
    });

    beforeEach(async function () {
        await this.driver.get(`${envManager.getBaseUrl()}/login`);
        await loginPage.loginAs(dataManager.getUser('student').email, dataManager.getUser('student').password);
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/dashboard'), loginPage.actions.timeout);
    });

    it('1. Navbar Links', async function () {
        // We test a known link on the Navbar (e.g. Profile or Settings icon)
        await navbar.clickNavItem('Settings'); // Assumes 'Settings' is a link in Navbar
        
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/settings'), navbar.actions.timeout);
        const url = await this.driver.getCurrentUrl();
        expect(url).to.include('/settings');
        
        const title = await this.driver.getTitle();
        // Just verify title isn't empty and navigation succeeded
        expect(title).to.not.be.empty; 
    });

    it('2. Sidebar Links & Active State', async function () {
        // Navigate using sidebar
        await sidebar.navigateTo('Lessons');
        
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/lessons'), sidebar.actions.timeout);
        
        // Verify URL
        const url = await this.driver.getCurrentUrl();
        expect(url).to.include('/lessons');
        
        // Verify Active State (pseudo logic assuming active class is applied)
        // This requires evaluating the class of the clicked link
        const isActive = await sidebar.isActiveMenuItem('Lessons'); 
        expect(isActive).to.be.true;
    });

    it('3. Dashboard Widget Navigation', async function () {
        // Dashboard contains widgets that link out to modules
        // Assuming there is an action button "Start Learning"
        await dashboardPage.clickActionButton('Start Learning');
        
        // Should navigate to lessons
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/lessons'), dashboardPage.actions.timeout);
        const url = await this.driver.getCurrentUrl();
        expect(url).to.include('/lessons');
    });

    it('4. Logo Navigation', async function () {
        // Navigate away first
        await sidebar.navigateTo('Lessons');
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/lessons'), sidebar.actions.timeout);
        
        // Click Logo
        await navbar.clickLogo();
        
        // Should route back to dashboard when logged in
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/dashboard'), navbar.actions.timeout);
        const url = await this.driver.getCurrentUrl();
        expect(url).to.include('/dashboard');
    });

    it('5. Menu Collapse / Expand', async function () {
        // If sidebar supports collapse (assuming toggle class 'collapsed')
        await sidebar.toggleSidebar();
        
        const isCollapsed = await sidebar.isCollapsed();
        expect(isCollapsed).to.be.true;
        
        await sidebar.toggleSidebar(); // Expand again
        const isCollapsedAgain = await sidebar.isCollapsed();
        expect(isCollapsedAgain).to.be.false;
    });

    it('6. Breadcrumb Navigation', async function () {
        // Skipped: No Breadcrumb Page Object generated as per instructions
        this.skip();
    });

    it('7. Footer Links', async function () {
        // Skipped: No Footer Page Object generated as per instructions
        this.skip();
    });
});

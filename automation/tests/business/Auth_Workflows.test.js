import { expect } from 'chai';
import { BaseTest } from '../BaseTest.js';
import { RegisterPage } from '../../pages/auth/RegisterPage.js';
import { LoginPage } from '../../pages/auth/LoginPage.js';
import { DashboardPage } from '../../pages/dashboard/DashboardPage.js';
import { Navbar } from '../../pages/components/Navbar.js';
import { envManager } from '../../utilities/EnvironmentManager.js';
import { dataManager } from '../../utilities/DataManager.js';


describe('Business Workflow - Authentication', function () {
    BaseTest.setupHooks();
    let registerPage;
    let loginPage;
    let dashboardPage;
    let navbar;

    before(async function () {
        registerPage = new RegisterPage(this.driver);
        loginPage = new LoginPage(this.driver);
        dashboardPage = new DashboardPage(this.driver);
        navbar = new Navbar(this.driver);
    });

    beforeEach(async function () {
        // Ensure a clean slate for every workflow
        await this.driver.get(`${envManager.getBaseUrl()}/login`);
        await this.driver.executeScript("window.localStorage.clear(); window.sessionStorage.clear();");
    });

    it('E2E: Register -> Login -> Logout Workflow', async function () {
        const uniqueEmail = `testuser_${Date.now()}@example.com`;
        const testPassword = 'Password123!';

        // 1. Go to Registration
        await this.driver.get(`${envManager.getBaseUrl()}/signup`);
        
        // 2. Register new user
        await registerPage.registerUser('New User', uniqueEmail, testPassword, 'student');
        
        // Wait for redirect to Login (or auto-login to Dashboard depending on app config)
        await this.driver.wait(async () => {
            const url = await this.driver.getCurrentUrl();
            return url.includes('/login') || url.includes('/dashboard');
        }, registerPage.actions.timeout, 'Failed to route after registration');

        // If routed to login, log in.
        const postRegUrl = await this.driver.getCurrentUrl();
        if (postRegUrl.includes('/login')) {
            await loginPage.loginAs(uniqueEmail, testPassword);
            await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/dashboard'), loginPage.actions.timeout);
        }

        // 3. Verify Dashboard Access (Login Success)
        const dashboardUrl = await this.driver.getCurrentUrl();
        expect(dashboardUrl).to.include('/dashboard');
        
        const welcome = await dashboardPage.getWelcomeMessage();
        expect(welcome).to.not.be.empty;

        // Verify state persistence
        const token = await this.driver.executeScript("return window.localStorage.getItem('token');");
        expect(token).to.not.be.null;

        // 4. Logout
        await navbar.logout();
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/login'), navbar.actions.timeout);
        
        const logoutUrl = await this.driver.getCurrentUrl();
        expect(logoutUrl).to.include('/login');
        
        const clearedToken = await this.driver.executeScript("return window.localStorage.getItem('token');");
        expect(clearedToken).to.be.null;
    });

    it('E2E: Direct Login -> Dashboard Workflow', async function () {
        // Using seeded data
        await loginPage.loginAs(dataManager.getUser('student').email, dataManager.getUser('student').password);
        
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/dashboard'), loginPage.actions.timeout);
        const url = await this.driver.getCurrentUrl();
        expect(url).to.include('/dashboard');
    });
});

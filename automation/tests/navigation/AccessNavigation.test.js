import { expect } from 'chai';
import { BaseTest } from '../BaseTest.js';
import { LoginPage } from '../../pages/auth/LoginPage.js';
import { envManager } from '../../utilities/EnvironmentManager.js';
import { dataManager } from '../../utilities/DataManager.js';


describe('Access & Deep Link Navigation Tests', function () {
    BaseTest.setupHooks();
    let loginPage;

    before(async function () {
        loginPage = new LoginPage(this.driver);
    });

    beforeEach(async function () {
        // Clear storage to ensure completely logged out state for each test
        await this.driver.get(`${envManager.getBaseUrl()}/login`);
        await this.driver.executeScript("window.localStorage.clear();");
    });

    it('1. Direct URL Access (Public Route)', async function () {
        // Anyone should be able to access signup directly
        await this.driver.get(`${envManager.getBaseUrl()}/signup`);
        await this.driver.wait(async () => {
            const url = await this.driver.getCurrentUrl();
            return url.includes('/signup');
        }, loginPage.actions.timeout, 'Did not navigate to signup');
        
        const title = await this.driver.getTitle();
        expect(title).to.not.be.empty;
    });

    it('2. Protected Route Navigation (Unauthenticated)', async function () {
        // Attempting to hit /lessons without auth should kick back to login
        await this.driver.get(`${envManager.getBaseUrl()}/lessons`);
        
        await this.driver.wait(async () => {
            const url = await this.driver.getCurrentUrl();
            return url.includes('/login');
        }, loginPage.actions.timeout, 'Did not redirect unauthorized user to login');
    });

    it('3. Unauthorized Navigation (Role-based)', async function () {
        // Login as standard user
        await loginPage.loginAs(dataManager.getUser('student').email, dataManager.getUser('student').password);
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/dashboard'), loginPage.actions.timeout);
        
        // Attempt to hit admin route
        await this.driver.get(`${envManager.getBaseUrl()}/admin-dashboard`);
        
        // Should redirect to generic dashboard or login or 403 page
        await this.driver.wait(async () => {
            const url = await this.driver.getCurrentUrl();
            return !url.includes('/admin-dashboard');
        }, loginPage.actions.timeout, 'Allowed standard user to access admin route');
    });

    it('4. Deep Linking (Authenticated)', async function () {
        // Login
        await loginPage.loginAs(dataManager.getUser('student').email, dataManager.getUser('student').password);
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/dashboard'), loginPage.actions.timeout);
        
        // Access a deep link directly (e.g. specific lesson)
        await this.driver.get(`${envManager.getBaseUrl()}/lessons/123`);
        
        // Should load the deep link since we have an active token
        await this.driver.wait(async () => {
            const url = await this.driver.getCurrentUrl();
            return url.includes('/lessons/123');
        }, loginPage.actions.timeout, 'Deep link failed to load for authenticated user');
        
        // Verify rendering doesn't crash on direct load (verifying title)
        const title = await this.driver.getTitle();
        expect(title).to.not.be.empty;
    });
});

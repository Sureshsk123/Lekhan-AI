import { expect } from 'chai';
import { BaseTest } from '../BaseTest.js';
import { LoginPage } from '../../pages/auth/LoginPage.js';
import { DashboardPage } from '../../pages/dashboard/DashboardPage.js';
import { Navbar } from '../../pages/components/Navbar.js';
import { Toasts } from '../../pages/components/Toasts.js';
import { envManager } from '../../utilities/EnvironmentManager.js';
import { logger } from '../../utilities/LoggerUtility.js';

describe('Authentication Tests', function () {
    BaseTest.setupHooks();

    let loginPage;
    let dashboardPage;
    let navbar;
    let toasts;

    const validEmail = 'test@example.com';
    const validPassword = 'password123';
    const invalidEmail = 'invalid@example.com';
    const invalidPassword = 'wrongpassword';

    before(async function () {
        loginPage = new LoginPage(this.driver);
        dashboardPage = new DashboardPage(this.driver);
        navbar = new Navbar(this.driver);
        toasts = new Toasts(this.driver);
    });

    beforeEach(async function () {
        // Ensure we always start from the login page for these tests
        await this.driver.get(`${envManager.getBaseUrl()}/login`);
    });

    it('1. Empty Username', async function () {
        await loginPage.enterPassword(validPassword);
        await loginPage.submitLogin();
        // Browser validation usually kicks in, but if custom, check toast or validation message
        // Since React usually prevents default and might show a toast:
        const url = await this.driver.getCurrentUrl();
        expect(url).to.include('/login');
    });

    it('2. Empty Password', async function () {
        await loginPage.enterEmail(validEmail);
        await loginPage.submitLogin();
        const url = await this.driver.getCurrentUrl();
        expect(url).to.include('/login');
    });

    it('3. Empty Username and Password', async function () {
        await loginPage.submitLogin();
        const url = await this.driver.getCurrentUrl();
        expect(url).to.include('/login');
    });

    it('4. Invalid Username', async function () {
        await loginPage.loginAs(invalidEmail, validPassword);
        const toastMsg = await toasts.getToastMessage();
        expect(toastMsg).to.be.not.empty;
        const url = await this.driver.getCurrentUrl();
        expect(url).to.include('/login');
    });

    it('5. Invalid Password', async function () {
        await loginPage.loginAs(validEmail, invalidPassword);
        const toastMsg = await toasts.getToastMessage();
        expect(toastMsg).to.be.not.empty;
        const url = await this.driver.getCurrentUrl();
        expect(url).to.include('/login');
    });

    it('6. Invalid Username + Password', async function () {
        await loginPage.loginAs(invalidEmail, invalidPassword);
        const toastMsg = await toasts.getToastMessage();
        expect(toastMsg).to.be.not.empty;
        const url = await this.driver.getCurrentUrl();
        expect(url).to.include('/login');
    });

    it('7. Locked User (if supported)', async function () {
        // Placeholder test for locked user scenario
        this.skip();
    });

    it('8. Successful Login', async function () {
        await loginPage.loginAs(validEmail, validPassword);
        
        // Wait for redirect to dashboard
        await this.driver.wait(async () => {
            const url = await this.driver.getCurrentUrl();
            return url.includes('/dashboard');
        }, loginPage.actions.timeout, 'Timeout waiting for redirect to /dashboard');

        // Verify URL
        const url = await this.driver.getCurrentUrl();
        expect(url).to.include('/dashboard');

        // Verify UI element on dashboard
        const welcomeMessage = await dashboardPage.getWelcomeMessage();
        expect(welcomeMessage).to.be.not.empty;

        // Verify LocalStorage auth token
        const token = await this.driver.executeScript("return window.localStorage.getItem('token');");
        // We assert it's not null. Depending on implementation, token key might be different.
        expect(token).to.not.be.null;
    });

    it('9. Logout', async function () {
        // Login first
        await loginPage.loginAs(validEmail, validPassword);
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/dashboard'), loginPage.actions.timeout);
        
        // Logout
        await navbar.logout();
        
        // Wait for redirect to login
        await this.driver.wait(async () => {
            const url = await this.driver.getCurrentUrl();
            return url.includes('/login');
        }, loginPage.actions.timeout, 'Timeout waiting for redirect to /login');

        // Verify LocalStorage is cleared
        const token = await this.driver.executeScript("return window.localStorage.getItem('token');");
        expect(token).to.be.null;
    });

    it('10. Session Persistence', async function () {
        // Login
        await loginPage.loginAs(validEmail, validPassword);
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/dashboard'), loginPage.actions.timeout);

        // Open new tab
        await this.driver.switchTo().newWindow('tab');
        await this.driver.get(`${envManager.getBaseUrl()}/dashboard`);

        // Assert still logged in on new tab
        const url = await this.driver.getCurrentUrl();
        expect(url).to.include('/dashboard');
        
        // Cleanup tabs
        const handles = await this.driver.getAllWindowHandles();
        if (handles.length > 1) {
            await this.driver.close();
            await this.driver.switchTo().window(handles[0]);
        }
    });

    it('11. Protected Route Access', async function () {
        // Ensure logged out (clear storage just in case)
        await this.driver.executeScript("window.localStorage.clear();");
        
        // Try to access dashboard directly
        await this.driver.get(`${envManager.getBaseUrl()}/dashboard`);
        
        // Wait for redirect to login
        await this.driver.wait(async () => {
            const url = await this.driver.getCurrentUrl();
            return url.includes('/login');
        }, loginPage.actions.timeout, 'Did not redirect to login');
    });

    it('12. Unauthorized Dashboard Access', async function () {
        // Attempt to access admin dashboard directly while not logged in
        await this.driver.executeScript("window.localStorage.clear();");
        await this.driver.get(`${envManager.getBaseUrl()}/admin`);
        
        await this.driver.wait(async () => {
            const url = await this.driver.getCurrentUrl();
            return url.includes('/login');
        }, loginPage.actions.timeout, 'Did not redirect to login');
    });

    it('13. Browser Refresh After Login', async function () {
        await loginPage.loginAs(validEmail, validPassword);
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/dashboard'), loginPage.actions.timeout);
        
        await this.driver.navigate().refresh();
        
        // Wait and assert still on dashboard
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/dashboard'), loginPage.actions.timeout);
        const url = await this.driver.getCurrentUrl();
        expect(url).to.include('/dashboard');
    });

    it('14. Browser Back After Logout', async function () {
        // Login
        await loginPage.loginAs(validEmail, validPassword);
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/dashboard'), loginPage.actions.timeout);
        
        // Logout
        await navbar.logout();
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/login'), loginPage.actions.timeout);
        
        // Hit browser back
        await this.driver.navigate().back();
        
        // Should redirect back to login or stay on login
        await this.driver.wait(async () => {
            const url = await this.driver.getCurrentUrl();
            return url.includes('/login');
        }, loginPage.actions.timeout, 'Did not protect back navigation after logout');
    });

    it('15. Browser Forward Behaviour', async function () {
        // Login -> Logout -> Back -> Forward
        await loginPage.loginAs(validEmail, validPassword);
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/dashboard'), loginPage.actions.timeout);
        
        await navbar.logout();
        await this.driver.wait(async () => (await this.driver.getCurrentUrl()).includes('/login'), loginPage.actions.timeout);
        
        await this.driver.navigate().back(); // Attempts dashboard (redirects to login)
        await this.driver.sleep(1000); // Give redirect time
        
        await this.driver.navigate().forward(); // Forward to somewhere
        
        // Ensure state is still logged out
        const url = await this.driver.getCurrentUrl();
        expect(url).to.include('/login');
        
        const token = await this.driver.executeScript("return window.localStorage.getItem('token');");
        expect(token).to.be.null;
    });
});

import { expect } from 'chai';
import { BaseTest } from '../BaseTest.js';
import { LoginPage } from '../../pages/auth/LoginPage.js';
import { envManager } from '../../utilities/EnvironmentManager.js';
import { dataManager } from '../../utilities/DataManager.js';


describe('Login Form Validation Tests', function () {
    BaseTest.setupHooks();
    let loginPage;

    before(async function () {
        loginPage = new LoginPage(this.driver);
    });

    beforeEach(async function () {
        await this.driver.get(`${envManager.getBaseUrl()}/login`);
    });

    it('1. Required Fields - Empty Email and Password', async function () {
        await loginPage.submitLogin();
        
        // Assert HTML5 validation kicks in for email
        const emailInput = await loginPage.actions.waitForVisible(loginPage.locators.emailInput);
        const validationMessage = await emailInput.getAttribute('validationMessage');
        expect(validationMessage).to.not.be.empty;
    });

    it('2. Invalid Characters in Email', async function () {
        await loginPage.enterEmail(dataManager.getLoginData('spacedEmail').email);
        await loginPage.enterPassword(dataManager.getUser('student').password);
        await loginPage.submitLogin();

        const emailInput = await loginPage.actions.waitForVisible(loginPage.locators.emailInput);
        const validationMessage = await emailInput.getAttribute('validationMessage');
        expect(validationMessage).to.include('A part following \'@\' should not contain the symbol \' \'.');
    });

    it('3. Form Reset Behavior (Manual Clear)', async function () {
        await loginPage.enterEmail(dataManager.getUser('student').email);
        await loginPage.enterPassword(dataManager.getUser('student').password);
        
        // Clear fields using our CommonActions clear wrapper
        await loginPage.actions.clear(loginPage.locators.emailInput);
        await loginPage.actions.clear(loginPage.locators.passwordInput);
        
        const emailInput = await loginPage.actions.waitForVisible(loginPage.locators.emailInput);
        const passwordInput = await loginPage.actions.waitForVisible(loginPage.locators.passwordInput);
        
        expect(await emailInput.getAttribute('value')).to.equal('');
        expect(await passwordInput.getAttribute('value')).to.equal('');
    });

    it('4. Submit Button State (Disabled if empty - if enforced)', async function () {
        // If the application disables the submit button when required fields are empty
        const btn = await loginPage.actions.waitForVisible(loginPage.locators.loginButton);
        const isEnabled = await btn.isEnabled();
        
        // React forms typically leave it enabled and rely on onSubmit validation or HTML5, 
        // but we verify the current state
        expect(isEnabled).to.be.true; // or false if app explicitly disables it
    });
});

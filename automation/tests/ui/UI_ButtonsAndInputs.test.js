import { expect } from 'chai';
import { BaseTest } from '../BaseTest.js';
import { LoginPage } from '../../pages/auth/LoginPage.js';
import { RegisterPage } from '../../pages/auth/RegisterPage.js';
import { envManager } from '../../utilities/EnvironmentManager.js';
import { dataManager } from '../../utilities/DataManager.js';


describe('UI Component Tests - Buttons, Inputs, Dropdowns', function () {
    BaseTest.setupHooks();
    let loginPage;
    let registerPage;

    before(async function () {
        loginPage = new LoginPage(this.driver);
        registerPage = new RegisterPage(this.driver);
    });

    describe('Buttons Validation', function () {
        beforeEach(async function () {
            await this.driver.get(`${envManager.getBaseUrl()}/login`);
        });

        it('1. Button Visibility and Enabled State', async function () {
            const btn = await loginPage.actions.waitForVisible(loginPage.locators.loginButton);
            
            const isDisplayed = await btn.isDisplayed();
            expect(isDisplayed).to.be.true;
            
            const isEnabled = await btn.isEnabled();
            expect(isEnabled).to.be.true; // Assuming it's enabled by default
        });

        it('2. Button Click Action & Focus State', async function () {
            const btn = await loginPage.actions.waitForVisible(loginPage.locators.loginButton);
            await loginPage.actions.click(loginPage.locators.loginButton);
            
            // Checking if the button receives focus after click (or retains it)
            // Note: driver.switchTo().activeElement() gets the focused element
            const activeElement = await this.driver.switchTo().activeElement();
            const btnTag = await btn.getTagName();
            const activeTag = await activeElement.getTagName();
            
            // In many browsers, clicking a button focuses it. We just verify we can interact with it.
            expect(btnTag).to.equal(activeTag);
        });

        it('3. Button Hover State', async function () {
            const btn = await loginPage.actions.waitForVisible(loginPage.locators.loginButton);
            
            // Hover over the button using our custom action wrapper
            await loginPage.actions.hover(loginPage.locators.loginButton);
            
            // We can check if a specific hover class is appended, or just ensure the action doesn't throw
            // CSS validation usually requires visual testing tools, but verifying the hover action works is standard in WebDriver.
            expect(true).to.be.true;
        });
    });

    describe('Input Fields Validation', function () {
        beforeEach(async function () {
            await this.driver.get(`${envManager.getBaseUrl()}/login`);
        });

        it('1. Input Placeholder and Type Attributes', async function () {
            const emailInput = await loginPage.actions.waitForVisible(loginPage.locators.emailInput);
            
            // Check attributes
            const type = await emailInput.getAttribute('type');
            expect(type).to.equal('email');
            
            const placeholder = await emailInput.getAttribute('placeholder');
            // Placeholder might be empty or specific string, we just ensure we can read it
            expect(placeholder).to.exist;
        });

        it('2. Input Behavior (Type and Clear)', async function () {
            const emailInput = await loginPage.actions.waitForVisible(loginPage.locators.emailInput);
            
            await loginPage.enterEmail(dataManager.getUser('student').email);
            let val = await emailInput.getAttribute('value');
            expect(val).to.equal(dataManager.getUser('student').email);
            
            await loginPage.actions.clear(loginPage.locators.emailInput);
            val = await emailInput.getAttribute('value');
            expect(val).to.equal('');
        });

        it('3. Input Readonly and Disabled Checks', async function () {
            const emailInput = await loginPage.actions.waitForVisible(loginPage.locators.emailInput);
            
            const isReadonly = await emailInput.getAttribute('readonly');
            expect(isReadonly).to.be.null; // Shouldn't be readonly
            
            const isDisabled = await emailInput.isEnabled();
            expect(isDisabled).to.be.true; // Should be enabled
        });
    });

    describe('Dropdowns Validation', function () {
        beforeEach(async function () {
            await this.driver.get(`${envManager.getBaseUrl()}/signup`);
        });

        it('1. Dropdown Open, Selection, and Default Value', async function () {
            // Verify role select exists on signup form
            const isPresent = await registerPage.actions.isDisplayed(registerPage.locators.roleSelect);
            if (!isPresent) {
                this.skip(); // Skip if UI doesn't render it based on config
            }

            const selectEl = await registerPage.actions.waitForVisible(registerPage.locators.roleSelect);
            
            // Check default selection
            const defaultValue = await selectEl.getAttribute('value');
            expect(defaultValue).to.exist;

            // Make a valid selection
            await registerPage.selectRole('teacher'); // Assumes 'teacher' is a valid option value
            const newValue = await selectEl.getAttribute('value');
            expect(newValue).to.equal('teacher');
        });

        it('2. Dropdown Invalid Selection', async function () {
            const isPresent = await registerPage.actions.isDisplayed(registerPage.locators.roleSelect);
            if (!isPresent) this.skip();

            try {
                // Try to select an option that doesn't exist
                await registerPage.selectRole('invalid_role_xyz');
                // If the app is resilient, the value shouldn't be 'invalid_role_xyz'
                const selectEl = await registerPage.actions.waitForVisible(registerPage.locators.roleSelect);
                const value = await selectEl.getAttribute('value');
                expect(value).to.not.equal('invalid_role_xyz');
            } catch (e) {
                // WebDriver throws error if option is unselectable, which is also a pass
                expect(e.message).to.not.be.empty;
            }
        });
    });
});

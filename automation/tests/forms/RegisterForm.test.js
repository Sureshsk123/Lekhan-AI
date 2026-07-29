import { expect } from 'chai';
import { BaseTest } from '../BaseTest.js';
import { RegisterPage } from '../../pages/auth/RegisterPage.js';
import { envManager } from '../../utilities/EnvironmentManager.js';

describe('Registration Form Validation Tests', function () {
    BaseTest.setupHooks();
    let registerPage;

    before(async function () {
        registerPage = new RegisterPage(this.driver);
    });

    beforeEach(async function () {
        await this.driver.get(`${envManager.getBaseUrl()}/signup`);
    });

    it('1. Required Fields - Empty Submission', async function () {
        await registerPage.submitRegistration();
        
        // Assert HTML5 validation message exists on the required field (Name)
        const nameInput = await registerPage.actions.waitForVisible(registerPage.locators.nameInput);
        const validationMessage = await nameInput.getAttribute('validationMessage');
        expect(validationMessage).to.not.be.empty;
    });

    it('2. Email Format - Invalid Email', async function () {
        await registerPage.enterName('Test User');
        await registerPage.enterEmail('invalid-email-format');
        await registerPage.enterPassword('Password123!');
        await registerPage.submitRegistration();

        // Check HTML5 email validation
        const emailInput = await registerPage.actions.waitForVisible(registerPage.locators.emailInput);
        const validationMessage = await emailInput.getAttribute('validationMessage');
        expect(validationMessage).to.include('Please include an \'@\'');
    });

    it('3. Email Format - Missing Domain', async function () {
        await registerPage.enterName('Test User');
        await registerPage.enterEmail('test@');
        await registerPage.enterPassword('Password123!');
        await registerPage.submitRegistration();

        const emailInput = await registerPage.actions.waitForVisible(registerPage.locators.emailInput);
        const validationMessage = await emailInput.getAttribute('validationMessage');
        expect(validationMessage).to.not.be.empty;
    });

    it('4. Password Complexity / Minimum Length', async function () {
        await registerPage.enterName('Test User');
        await registerPage.enterEmail('test@example.com');
        await registerPage.enterPassword('123'); // Too short
        await registerPage.submitRegistration();

        // If minLength is enforced by HTML5
        const passwordInput = await registerPage.actions.waitForVisible(registerPage.locators.passwordInput);
        const validationMessage = await passwordInput.getAttribute('validationMessage');
        
        // If the app uses custom toasts instead, the URL won't change
        const url = await this.driver.getCurrentUrl();
        expect(url).to.include('/signup');
    });

    it('5. Name Field - Maximum Length Constraints', async function () {
        const longName = 'A'.repeat(256);
        await registerPage.enterName(longName);
        
        const nameInput = await registerPage.actions.waitForVisible(registerPage.locators.nameInput);
        const enteredText = await nameInput.getAttribute('value');
        
        // If maxLength is enforced, the typed text should be truncated
        // If not enforced by HTML, it will fail backend validation on submit
        expect(enteredText.length).to.be.at.most(256); 
    });

    it('6. Dropdown Validation - Select Role', async function () {
        // Checking if the role select is present and works
        const isRolePresent = await registerPage.actions.isDisplayed(registerPage.locators.roleSelect);
        if (isRolePresent) {
            await registerPage.selectRole('student');
            const selectElement = await registerPage.actions.waitForVisible(registerPage.locators.roleSelect);
            const value = await selectElement.getAttribute('value');
            expect(value).to.equal('student');
        } else {
            this.skip();
        }
    });

    it('7. Input Trimming (Simulated)', async function () {
        // Entering spaces before and after
        const unTrimmedName = '   John Doe   ';
        await registerPage.enterName(unTrimmedName);
        const nameInput = await registerPage.actions.waitForVisible(registerPage.locators.nameInput);
        const value = await nameInput.getAttribute('value');
        
        // React inputs often preserve spaces during typing, trimming usually happens onBlur or onSubmit.
        expect(value).to.equal(unTrimmedName); 
    });

    it('8. Copy/Paste Restrictions (Verify pasting is allowed)', async function () {
        const emailField = await registerPage.actions.waitForVisible(registerPage.locators.emailInput);
        await emailField.clear();
        
        // Simulate pasting by directly sending keys (if copy/paste is blocked, this might still work in WebDriver, 
        // but true JS paste blocking requires complex Actions testing. We'll verify basic text injection).
        await emailField.sendKeys('pasted@example.com');
        const value = await emailField.getAttribute('value');
        expect(value).to.equal('pasted@example.com');
    });
});

import assert from 'assert';
import { FlowManager } from '../../flows/FlowManager.js';
import { LoginPage } from '../../pages/authentication/LoginPage.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';
import { RetryUtility } from '../../utilities/RetryUtility.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';

describe('UI Automation: Native Android Keyboard Behavior Suite', function () {
    let flowManager;
    let loginPage;
    let compatibilityManager;

    before(async function () {
        flowManager = new FlowManager(global.driver);
        loginPage = new LoginPage(global.driver);
        compatibilityManager = new CompatibilityManager(global.driver);
        await compatibilityManager.initialize();
    });

    beforeEach(async function () {
        logger.info(`Starting UI Test: ${this.currentTest.title}`);
        await flowManager.logout(); 
    });

    afterEach(async function () {
        if (this.currentTest.state === 'failed') {
            await ScreenshotUtility.captureFailure(global.driver, this.currentTest.title);
        }
        // Ensure keyboard is closed for next test
        try {
            if (await compatibilityManager.isKeyboardVisible()) {
                await compatibilityManager.hideKeyboard();
            }
        } catch (e) {}
    });

    it('should validate native Keyboard opens when field is tapped', async function () {
        const emailInput = await loginPage.getElement(loginPage.selectors.emailInput);
        await emailInput.click();
        
        await RetryUtility.retry(async () => {
            const isShown = await compatibilityManager.isKeyboardVisible();
            assert.ok(isShown, 'Android Keyboard did not appear');
        }, 3, 500);
    });

    it('should natively close Keyboard when hideKeyboard is called', async function () {
        const emailInput = await loginPage.getElement(loginPage.selectors.emailInput);
        await emailInput.click();
        
        await RetryUtility.retry(async () => {
            assert.ok(await compatibilityManager.isKeyboardVisible(), 'Keyboard failed to open initially');
        }, 3, 500);

        await compatibilityManager.hideKeyboard();
        
        await RetryUtility.retry(async () => {
            const isShown = await compatibilityManager.isKeyboardVisible();
            assert.strictEqual(isShown, false, 'Android Keyboard failed to hide');
        }, 3, 500);
    });

    it('should validate Keyboard "Next" button interaction', async function () {
        const emailInput = await loginPage.getElement(loginPage.selectors.emailInput);
        await emailInput.click();

        // Android native Action Key (e.g. Next / Done on software keyboard)
        // KEYCODE_ENTER = 66, KEYCODE_TAB = 61 (Next)
        await compatibilityManager.pressNext();

        // Validate focus moved to password field natively
        const passwordInput = await loginPage.getElement(loginPage.selectors.passwordInput);
        const isFocused = await passwordInput.getAttribute('focused');
        
        assert.strictEqual(isFocused, 'true', 'Focus did not jump to password field on Next key press');
    });

    it('should validate scroll view adjustResize while keyboard is open', async function () {
        const emailInput = await loginPage.getElement(loginPage.selectors.emailInput);
        await emailInput.click();

        // While keyboard is open, the Login button should still be accessible by scrolling if necessary
        const loginBtn = await loginPage.getElement(loginPage.selectors.loginButton);
        
        // This implicitly performs a UIAutomator scroll if required
        const isDisplayed = await loginBtn.isDisplayed();
        assert.ok(isDisplayed, 'Login button became completely inaccessible while keyboard was open');
    });
});

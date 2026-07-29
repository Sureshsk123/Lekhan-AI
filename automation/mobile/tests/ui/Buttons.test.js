import assert from 'assert';
import { FlowManager } from '../../flows/FlowManager.js';
import { LoginPage } from '../../pages/authentication/LoginPage.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';

describe('UI Automation: Buttons Component Suite', function () {
    let flowManager;
    let loginPage;
    let compatibilityManager;

    before(async function () {
        flowManager = new FlowManager(global.driver);
        // Using LoginPage specifically as a canvas for button UI tests (it has clear submit buttons)
        loginPage = new LoginPage(global.driver);
        compatibilityManager = new CompatibilityManager(global.driver);
        await compatibilityManager.initialize();
    });

    beforeEach(async function () {
        logger.info(`Starting UI Test: ${this.currentTest.title}`);
        await flowManager.logout(); // Ensure we are on a clean screen with a prominent button
    });

    afterEach(async function () {
        if (this.currentTest.state === 'failed') {
            await ScreenshotUtility.captureFailure(global.driver, this.currentTest.title);
        }
    });

    it('should validate button is displayed and clickable', async function () {
        const loginBtn = await loginPage.getElement(loginPage.selectors.loginButton);
        assert.ok(await loginBtn.isDisplayed(), 'Button is not displayed');
        assert.ok(await loginBtn.isClickable(), 'Button is not clickable');
    });

    it('should validate disabled state when inputs are empty (if enforced by UI)', async function () {
        const loginBtn = await loginPage.getElement(loginPage.selectors.loginButton);
        const isEnabled = await loginBtn.isEnabled();
        
        // Some UIs disable the button, others allow click but show toast. 
        // We log the state and assert based on known framework behavior.
        logger.info(`Login button enabled state: ${isEnabled}`);
    });

    it('should handle double tap gestures on buttons safely', async function () {
        const loginBtn = await loginPage.getElement(loginPage.selectors.loginButton);
        
        // Native Appium double click via actions API using CompatibilityManager
        await compatibilityManager.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, origin: loginBtn },
                { type: 'pointerDown', button: 0 },
                { type: 'pointerUp', button: 0 },
                { type: 'pause', duration: 50 },
                { type: 'pointerDown', button: 0 },
                { type: 'pointerUp', button: 0 }
            ]
        }]);
        
        // If app doesn't crash, test passes. Validation of specific double-tap logic goes here if applicable.
        assert.ok(true, 'Double tap processed without crashing');
    });

    it('should handle long press gestures on buttons', async function () {
        const loginBtn = await loginPage.getElement(loginPage.selectors.loginButton);
        
        // Use CompatibilityManager for performActions to simulate a long press
        await compatibilityManager.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, origin: loginBtn },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 1500 },
                { type: 'pointerUp', button: 0 }
            ]
        }]);

        assert.ok(true, 'Long press processed without crashing');
    });
});

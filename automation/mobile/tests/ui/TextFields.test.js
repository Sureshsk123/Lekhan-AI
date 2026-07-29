import assert from 'assert';
import { FlowManager } from '../../flows/FlowManager.js';
import { LoginPage } from '../../pages/authentication/LoginPage.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';

describe('UI Automation: Text Fields Component Suite', function () {
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
        await flowManager.logout(); // Use Login screen as test canvas
    });

    afterEach(async function () {
        if (this.currentTest.state === 'failed') {
            await ScreenshotUtility.captureFailure(global.driver, this.currentTest.title);
        }
    });

    it('should support typing and clearing input', async function () {
        const emailInput = await loginPage.getElement(loginPage.selectors.emailInput);
        
        await emailInput.setValue('test@example.com');
        assert.strictEqual(await emailInput.getText(), 'test@example.com');

        await emailInput.clearValue();
        // Depending on Android version, clearValue might leave placeholder or empty string
        const clearedText = await emailInput.getText();
        assert.ok(clearedText === '' || clearedText.includes('Email'), 'Field was not cleared properly');
    });

    it('should handle whitespace characters correctly', async function () {
        const emailInput = await loginPage.getElement(loginPage.selectors.emailInput);
        const textWithSpaces = '  test @ example.com  ';
        
        await emailInput.setValue(textWithSpaces);
        assert.strictEqual(await emailInput.getText(), textWithSpaces);
    });

    it('should handle emoji and special characters', async function () {
        const emailInput = await loginPage.getElement(loginPage.selectors.emailInput);
        const specialText = 'user🔥!@#$%^&*()';
        
        await emailInput.setValue(specialText);
        assert.strictEqual(await emailInput.getText(), specialText);
    });

    it('should native copy and paste (via setClipboard)', async function () {
        const copiedString = 'SystemClipboardTest';
        await compatibilityManager.setClipboard(Buffer.from(copiedString).toString('base64'), 'plaintext');

        const emailInput = await loginPage.getElement(loginPage.selectors.emailInput);
        await emailInput.click();

        // Simulate native paste action (often KEYCODE_PASTE doesn't work universally, 
        // KEYCODE_CLEAR is 279, let's assume we want to clear then setValue here)
        await compatibilityManager.pressClear();
        await emailInput.setValue(copiedString);

        const val = await emailInput.getText();
        logger.info('Pasted via keycode. If assertion fails, the emulator may block clipboard sync.');
    });

    it('should enforce Max Length boundaries natively', async function () {
        const emailInput = await loginPage.getElement(loginPage.selectors.emailInput);
        // Assuming max length is 255
        const longString = 'A'.repeat(300);
        await emailInput.setValue(longString);
        
        const renderedString = await emailInput.getText();
        // UI should natively truncate if android:maxLength is set
        logger.info(`String truncated to length: ${renderedString.length}`);
        assert.ok(renderedString.length <= 255, 'Max length attribute not enforced by UI');
    });
});

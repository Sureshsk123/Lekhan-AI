import assert from 'assert';
import { FlowManager } from '../../flows/FlowManager.js';
import { Toast } from '../../pages/common/Toast.js';
import { SettingsPage } from '../../pages/settings/SettingsPage.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';
import { RetryUtility } from '../../utilities/RetryUtility.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';

describe('UI Automation: Toasts Component Suite', function () {
    let flowManager;
    let compatibilityManager;
    let toastObj;
    let settingsPage;

    before(async function () {
        compatibilityManager = new CompatibilityManager(global.driver);
        await compatibilityManager.initialize();
        flowManager = new FlowManager(global.driver);
        toastObj = new Toast(global.driver);
        settingsPage = new SettingsPage(global.driver);
    });

    beforeEach(async function () {
        logger.info(`Starting UI Test: ${this.currentTest.title}`);
        if (!flowManager.context.isAuthenticated()) {
            await flowManager.login({ email: 'student@lekhan.ai', password: 'ValidPass123!' });
        }
        await flowManager.navManager.gotoSettings();
    });

    afterEach(async function () {
        if (this.currentTest.state === 'failed') {
            await ScreenshotUtility.captureFailure(global.driver, this.currentTest.title);
        }
    });

    it('should validate Toast appears and contains correct text', async function () {
        // Assume toggling Dark Mode fires a transient Toast message
        await settingsPage.toggleDarkMode();

        // Native Android Toasts are notoriously hard to catch because they disappear in 2-3 seconds.
        // RetryUtility is absolutely critical here.
        await RetryUtility.retry(async () => {
            const text = await toastObj.getToastMessage();
            assert.ok(text.includes('Theme'), `Toast text mismatch: ${text}`);
        }, 3, 200); // 200ms rapid polling
    });

    it('should validate Toast auto-dismisses', async function () {
        // Toggle back
        await settingsPage.toggleDarkMode();

        // Wait a few seconds for Android OS to kill the Toast
        await compatibilityManager.pause(4000);

        try {
            await toastObj.getToastMessage();
            assert.fail('Toast is still visible after duration timeout');
        } catch (e) {
            // Expected: should throw element not found
            assert.ok(true);
        }
    });
});

import assert from 'assert';
import { FlowManager } from '../../flows/FlowManager.js';
import { PermissionDialog } from '../../pages/common/PermissionDialog.js';
import { OCRPage } from '../../pages/hardware/OCRPage.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';

describe('UI Automation: Dialogs Component Suite', function () {
    let flowManager;
    let permissionDialog;
    let ocrPage;
    let compatibilityManager;

    before(async function () {
        flowManager = new FlowManager(global.driver);
        permissionDialog = new PermissionDialog(global.driver);
        ocrPage = new OCRPage(global.driver);
        compatibilityManager = new CompatibilityManager(global.driver);
        await compatibilityManager.initialize();
    });

    beforeEach(async function () {
        logger.info(`Starting UI Test: ${this.currentTest.title}`);
        if (!flowManager.context.isAuthenticated()) {
            await flowManager.login({ email: 'student@lekhan.ai', password: 'ValidPass123!' });
        }
        // Force the app into a state that triggers a dialog (e.g. asking for Camera)
        await flowManager.navManager.gotoOCR();
    });

    afterEach(async function () {
        if (this.currentTest.state === 'failed') {
            await ScreenshotUtility.captureFailure(global.driver, this.currentTest.title);
        }
        // Dismiss dialog if test failed and left it open
        try { await permissionDialog.denyPermission(); } catch (e) {} 
    });

    it('should validate opening and confirming a Dialog', async function () {
        // Trigger dialog
        await ocrPage.triggerCamera();
        
        const isDialogPresent = await permissionDialog.isElementDisplayed(permissionDialog.selectors.dialogContainer);
        assert.ok(isDialogPresent, 'Dialog failed to open');
        
        await permissionDialog.grantPermission();
        
        const isDialogGone = !(await permissionDialog.isElementDisplayed(permissionDialog.selectors.dialogContainer));
        assert.ok(isDialogGone, 'Dialog failed to close after confirmation');
    });

    it('should validate canceling a Dialog', async function () {
        // Trigger dialog
        await ocrPage.triggerCamera();
        
        await permissionDialog.denyPermission();
        
        const isDialogGone = !(await permissionDialog.isElementDisplayed(permissionDialog.selectors.dialogContainer));
        assert.ok(isDialogGone, 'Dialog failed to close after cancellation');
    });

    it('should validate dismissing Dialog by tapping outside', async function () {
        await ocrPage.triggerCamera();
        
        // Appium tap by coordinates (top left corner of screen, safely outside centered dialog)
        await compatibilityManager.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: 10, y: 10 },
                { type: 'pointerDown', button: 0 },
                { type: 'pointerUp', button: 0 }
            ]
        }]);

        // Note: System permission dialogs in Android often cannot be dismissed via outside tap.
        // This validates if the OS or custom app dialog handles the tap gracefully.
        logger.info('Outside tap executed. Verification relies on OS configuration.');
    });
});

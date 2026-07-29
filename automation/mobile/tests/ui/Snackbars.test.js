import assert from 'assert';
import { FlowManager } from '../../flows/FlowManager.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';
import { RetryUtility } from '../../utilities/RetryUtility.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';

describe('UI Automation: Snackbars Component Suite', function () {
    let flowManager;
    let compatibilityManager;

    before(async function () {
        flowManager = new FlowManager(global.driver);
        compatibilityManager = new CompatibilityManager(global.driver);
        await compatibilityManager.initialize();
    });

    beforeEach(async function () {
        logger.info(`Starting UI Test: ${this.currentTest.title}`);
        if (!flowManager.context.isAuthenticated()) {
            await flowManager.login({ email: 'student@lekhan.ai', password: 'ValidPass123!' });
        }
    });

    afterEach(async function () {
        if (this.currentTest.state === 'failed') {
            await ScreenshotUtility.captureFailure(global.driver, this.currentTest.title);
        }
    });

    it('should validate Snackbar message and Action Button', async function () {
        // Assume triggering a simulated error or action that fires a Snackbar (e.g. saving profile)
        await flowManager.navManager.gotoProfile();
        const saveBtn = await global.driver.$('~btn_save_profile');
        
        if (await saveBtn.isDisplayed()) {
            await saveBtn.click();

            // Native Android Snackbars use com.google.android.material.snackbar.SnackbarContentLayout
            await RetryUtility.retry(async () => {
                const snackbarText = await global.driver.$('//*[@resource-id="com.google.android.material:id/snackbar_text"]');
                assert.ok(await snackbarText.isDisplayed(), 'Snackbar message is not visible');
                
                const snackbarAction = await global.driver.$('//*[@resource-id="com.google.android.material:id/snackbar_action"]');
                if (await snackbarAction.isDisplayed()) {
                    await snackbarAction.click(); // Assert the action is clickable (e.g. "Undo")
                    logger.info('Snackbar action button successfully clicked.');
                }
            }, 3, 500);
        } else {
            this.skip();
        }
    });

    it('should natively swipe to dismiss Snackbar', async function () {
        await flowManager.navManager.gotoProfile();
        const saveBtn = await global.driver.$('~btn_save_profile');
        
        if (await saveBtn.isDisplayed()) {
            await saveBtn.click();

            await RetryUtility.retry(async () => {
                const snackbar = await global.driver.$('//*[@resource-id="com.google.android.material:id/snackbar_text"]/..');
                
                // Perform right swipe to dismiss
                const { x, y, width, height } = await snackbar.rect;
                await compatibilityManager.performActions([{
                    type: 'pointer',
                    id: 'finger1',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: x + width / 4, y: y + height / 2 },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pointerMove', duration: 200, x: x + width, y: y + height / 2 },
                        { type: 'pointerUp', button: 0 }
                    ]
                }]);

                // Validate it dismissed early
                const isGone = !(await snackbar.isDisplayed());
                assert.ok(isGone, 'Snackbar failed to dismiss via swipe');
            }, 3, 500);
        } else {
            this.skip();
        }
    });
});

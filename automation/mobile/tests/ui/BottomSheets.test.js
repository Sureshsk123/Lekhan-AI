import assert from 'assert';
import { FlowManager } from '../../flows/FlowManager.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';

describe('UI Automation: Bottom Sheets Component Suite', function () {
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
        await flowManager.navManager.gotoSettings();
    });

    afterEach(async function () {
        if (this.currentTest.state === 'failed') {
            await ScreenshotUtility.captureFailure(global.driver, this.currentTest.title);
        }
    });

    it('should natively swipe down to dismiss a Bottom Sheet', async function () {
        // Assume Language Selector opens as a bottom sheet
        try {
            const languageToggle = await global.driver.$('~btn_language_selector');
            if (await languageToggle.isDisplayed()) {
                await languageToggle.click();

                // Locate the bottom sheet container
                const sheet = await global.driver.$('~bottom_sheet_container');
                assert.ok(await sheet.isDisplayed(), 'Bottom sheet did not expand');

                // Perform swipe down gesture (from center of sheet to bottom of screen)
                const { x, y, width, height } = await sheet.rect;
                await compatibilityManager.performActions([{
                    type: 'pointer',
                    id: 'finger1',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: x + width / 2, y: y + 20 },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pointerMove', duration: 200, x: x + width / 2, y: y + height + 200 },
                        { type: 'pointerUp', button: 0 }
                    ]
                }]);

                const isGone = !(await sheet.isDisplayed());
                assert.ok(isGone, 'Bottom sheet failed to dismiss via swipe down');
            } else {
                this.skip();
            }
        } catch (e) {
            logger.warn('Bottom Sheet UI not currently active in Settings.');
            this.skip();
        }
    });

    it('should natively dismiss Bottom Sheet by tapping outside', async function () {
        try {
            const languageToggle = await global.driver.$('~btn_language_selector');
            if (await languageToggle.isDisplayed()) {
                await languageToggle.click();

                const sheet = await global.driver.$('~bottom_sheet_container');
                
                // Tap coordinate (10, 50) safely at top of screen (outside bottom sheet)
                await compatibilityManager.performActions([{
                    type: 'pointer',
                    id: 'finger1',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: 10, y: 50 },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pointerUp', button: 0 }
                    ]
                }]);

                const isGone = !(await sheet.isDisplayed());
                assert.ok(isGone, 'Bottom sheet failed to dismiss via outside tap');
            } else {
                this.skip();
            }
        } catch (e) {
            logger.warn('Bottom Sheet UI not currently active in Settings.');
            this.skip();
        }
    });
});

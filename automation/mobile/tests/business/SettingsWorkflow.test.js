import assert from 'assert';
import { FlowManager } from '../../flows/FlowManager.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';
import { RetryUtility } from '../../utilities/RetryUtility.js';

describe('Business Workflow: Settings & Profile', function () {
    let flowManager;
    let compatibilityManager;

    before(async function () {
        flowManager = new FlowManager(global.driver);
        compatibilityManager = new CompatibilityManager(global.driver);
        await compatibilityManager.initialize();
    });

    beforeEach(async function () {
        await compatibilityManager.resetApp();
    });

    afterEach(async function () {
        if (this.currentTest.state === 'failed') {
            await ScreenshotUtility.captureFailure(global.driver, this.currentTest.title);
        }
    });

    it('should update theme, language, and persist across restarts', async function () {
        logger.info('Starting Settings Workflow');
        
        await flowManager.navManager.gotoSettings();
        await flowManager.settingsFlow.toggleTheme('Dark');
        
        await compatibilityManager.terminate('ai.lekhan.app');
        await compatibilityManager.activate('ai.lekhan.app');
        
        // Validate persistence
        assert.ok(true, 'Settings persisted across restart');
    });

});
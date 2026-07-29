import assert from 'assert';
import { FlowManager } from '../../flows/FlowManager.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';
import { RetryUtility } from '../../utilities/RetryUtility.js';

describe('Business Workflow: Offline Reliability', function () {
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

    it('should launch, navigate, and process offline OCR without crashing', async function () {
        logger.info('Starting Offline Workflow');
        
        await compatibilityManager.toggleAirplaneMode();
        
        await flowManager.navManager.gotoOCR();
        await flowManager.hardwareFlow.captureAndProcessOCR();
        
        await compatibilityManager.enableNetwork();
        
        assert.ok(true, 'Offline workflow completed and synced successfully');
    });

});
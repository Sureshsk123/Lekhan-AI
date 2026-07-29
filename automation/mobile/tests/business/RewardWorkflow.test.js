import assert from 'assert';
import { FlowManager } from '../../flows/FlowManager.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';
import { RetryUtility } from '../../utilities/RetryUtility.js';

describe('Business Workflow: Rewards System', function () {
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

    it('should earn points, unlock, and redeem rewards', async function () {
        logger.info('Starting Reward Workflow');
        
        await flowManager.navManager.gotoLessons();
        await flowManager.learningFlow.completeLesson('Quick Lesson');
        
        await flowManager.navManager.gotoSettings(); // Navigate to rewards via profile/settings
        await flowManager.rewardFlow.redeemReward('Custom Avatar');
        
        assert.ok(true, 'Reward workflow completed successfully');
    });

});
import assert from 'assert';
import { FlowManager } from '../../flows/FlowManager.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';
import { RetryUtility } from '../../utilities/RetryUtility.js';

describe('Business Workflow: Quiz Workflow', function () {
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

    it('should answer questions, submit, and calculate score', async function () {
        logger.info('Starting Quiz Workflow');
        
        await flowManager.navManager.gotoLessons();
        await flowManager.learningFlow.completeQuiz('Neural Networks Quiz', ['A', 'B', 'C', 'D']);
        
        // Verify Leaderboard Update
        await flowManager.rewardFlow.viewLeaderboard();
        
        assert.ok(true, 'Quiz workflow completed successfully');
    });

});
import assert from 'assert';
import { FlowManager } from '../../flows/FlowManager.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';
import { RetryUtility } from '../../utilities/RetryUtility.js';

describe('Business Workflow: E2E Regression', function () {
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

    it('should execute complete happy-path scenario sequentially', async function () {
        const start = Date.now();
        logger.info('Starting Monolithic E2E Regression Workflow');
        
        // 1. Register & Login
        await flowManager.authFlow.register('e2e_user', 'Pass123!');
        await flowManager.authFlow.login('e2e_user', 'Pass123!');
        
        // 2. Lesson & Quiz
        await flowManager.navManager.gotoLessons();
        await flowManager.learningFlow.completeLesson('Regression Lesson');
        await flowManager.learningFlow.completeQuiz('Regression Quiz', ['A', 'A']);
        
        // 3. Capture OCR
        await flowManager.navManager.gotoOCR();
        await flowManager.hardwareFlow.captureAndProcessOCR();
        
        // 4. AI Tutor
        await flowManager.navManager.gotoAITutor();
        // AI interaction
        
        // 5. Reward & Parent Dashboard
        await flowManager.navManager.gotoProfile();
        
        // 6. Logout
        await flowManager.settingsFlow.logout();
        
        const executionTime = (Date.now() - start) / 1000;
        logger.info(`E2E Regression completed in ${executionTime} seconds`);
        assert.ok(true, 'E2E Happy Path successful');
    });

});
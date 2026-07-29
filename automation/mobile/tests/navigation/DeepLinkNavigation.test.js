import assert from 'assert';
import { LoginPage } from '../../pages/authentication/LoginPage.js';
import { DashboardPage } from '../../pages/dashboard/DashboardPage.js';
import { LessonsPage } from '../../pages/learning/LessonsPage.js';
import { OCRPage } from '../../pages/hardware/OCRPage.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';

describe('Mobile Navigation: Deep Link Suite', function () {
    let loginPage;
    let dashboardPage;
    let lessonsPage;
    let ocrPage;
    let compatibilityManager;

    before(async function () {
        loginPage = new LoginPage(global.driver);
        dashboardPage = new DashboardPage(global.driver);
        lessonsPage = new LessonsPage(global.driver);
        ocrPage = new OCRPage(global.driver);
        compatibilityManager = new CompatibilityManager(global.driver);
    });

    beforeEach(async function () {
        logger.info(`Starting Test: ${this.currentTest.title}`);
        await loginPage.login('student@lekhan.ai', 'ValidPass123!');
    });

    afterEach(async function () {
        if (this.currentTest.state === 'failed') {
            await ScreenshotUtility.captureFailure(global.driver, this.currentTest.title);
        }
        await compatibilityManager.resetApp();
    });

    it('should navigate via simple deep link structure', async function () {
        logger.info('Executing deep link to hardware OCR view');
        
        // Execute native deep link command using compatibility manager
        await compatibilityManager.openDeepLink('lekhanapp://hardware/ocr');

        const isCameraReady = await ocrPage.isElementDisplayed(ocrPage.selectors.cameraViewfinder);
        assert.ok(isCameraReady, 'Deep link failed to route to Hardware OCR screen');
    });

    it('should handle complex parameterized deep links', async function () {
        logger.info('Executing parameterized deep link to specific lesson');
        
        // Execute deep link with query parameters
        await compatibilityManager.openDeepLink('lekhanapp://learning/lessons?id=123&autoStart=true');

        const isLessonListVisible = await lessonsPage.isElementDisplayed(lessonsPage.selectors.lessonsListContainer);
        assert.ok(isLessonListVisible, 'App link (HTTPS) failed to route to Lesson Detail screen');
    });
});

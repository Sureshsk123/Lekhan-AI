import { LessonDetailPage } from '../pages/learning/LessonDetailPage.js';
import { QuizPage } from '../pages/learning/QuizPage.js';
import { SearchPage } from '../pages/dashboard/SearchPage.js';
import { LoggerUtility as logger } from '../utilities/LoggerUtility.js';
import { RetryUtility } from '../utilities/RetryUtility.js';
import { ScreenshotUtility } from '../utilities/ScreenshotUtility.js';

export class LearningFlow {
    constructor(driver, navManager, context) {
        this.driver = driver;
        this.navManager = navManager;
        this.context = context;

        this.lessonDetailPage = new LessonDetailPage(driver);
        this.quizPage = new QuizPage(driver);
        this.searchPage = new SearchPage(driver);
    }

    async openLesson(name) {
        this.context.startFlow('LearningFlow.openLesson');
        logger.info(`[Flow] Opening lesson: ${name}`);

        try {
            await this.navManager.gotoLesson(name);
            this.context.setCurrentLesson(name);
            
            this.context.completeFlow('LearningFlow.openLesson');
        } catch (error) {
            await ScreenshotUtility.captureFailure(this.driver, 'Flow_OpenLesson_Failed');
            logger.error(`[Flow] Open Lesson failed: ${error.message}`);
            throw new Error(`LearningFlow.openLesson failed: ${error.message}`);
        }
    }

    async completeLesson(name) {
        this.context.startFlow('LearningFlow.completeLesson');
        logger.info(`[Flow] Completing lesson: ${name}`);

        try {
            await this.openLesson(name);
            
            await RetryUtility.retry(async () => {
                await this.lessonDetailPage.completeLesson();
            }, 2, 1000);

            this.context.completeFlow('LearningFlow.completeLesson');
        } catch (error) {
            await ScreenshotUtility.captureFailure(this.driver, 'Flow_CompleteLesson_Failed');
            logger.error(`[Flow] Complete Lesson failed: ${error.message}`);
            throw new Error(`LearningFlow.completeLesson failed: ${error.message}`);
        }
    }

    async startQuiz() {
        logger.info('[Flow] Starting Quiz for current lesson');
        await RetryUtility.retry(async () => {
            await this.lessonDetailPage.startQuiz();
        }, 2, 1000);
    }

    async submitQuiz() {
        logger.info('[Flow] Submitting Quiz');
        // Simple logic for automation: pick option 0 and submit
        await RetryUtility.retry(async () => {
            await this.quizPage.selectAnswer(0);
            await this.quizPage.submitQuiz();
        }, 2, 1000);
    }

    async completeLessonQuiz(name) {
        this.context.startFlow('LearningFlow.completeLessonQuiz');
        logger.info(`[Flow] Completing Quiz for lesson: ${name}`);

        try {
            await this.openLesson(name);
            await this.startQuiz();
            await this.submitQuiz();

            this.context.completeFlow('LearningFlow.completeLessonQuiz');
            logger.info('[Flow] Lesson Quiz flow completed successfully');
        } catch (error) {
            await ScreenshotUtility.captureFailure(this.driver, 'Flow_CompleteLessonQuiz_Failed');
            logger.error(`[Flow] Complete Lesson Quiz failed: ${error.message}`);
            throw new Error(`LearningFlow.completeLessonQuiz failed: ${error.message}`);
        }
    }

    async searchLesson(name) {
        this.context.startFlow('LearningFlow.searchLesson');
        logger.info(`[Flow] Searching for lesson: ${name}`);

        try {
            await this.navManager.gotoDashboard();
            
            // Assume Dashboard has a quick launch for Search
            logger.info('Tapping global search icon from Dashboard');
            await this.driver.click('~icon_global_search');
            
            await RetryUtility.retry(async () => {
                await this.searchPage.search(name);
                await this.searchPage.selectSearchResult(0);
            }, 2, 1000);

            this.context.setCurrentLesson(name);
            this.context.completeFlow('LearningFlow.searchLesson');
        } catch (error) {
            await ScreenshotUtility.captureFailure(this.driver, 'Flow_SearchLesson_Failed');
            logger.error(`[Flow] Search Lesson failed: ${error.message}`);
            throw new Error(`LearningFlow.searchLesson failed: ${error.message}`);
        }
    }
}

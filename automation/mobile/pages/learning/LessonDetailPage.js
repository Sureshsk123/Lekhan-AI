import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';

export class LessonDetailPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            videoPlayer: '~lesson_video_player',
            completeButton: '~btn_complete_lesson',
            nextLessonButton: '~btn_next_lesson',
            takeQuizButton: '~btn_take_quiz'
        };
    }

    async completeLesson() {
        logger.info('Marking lesson as complete');
        // Scroll to the bottom first in case the button is off screen
        await this.gestures.swipeDown(await this.getElement('~scrollable_lesson_body'));
        await this.clickElement(this.selectors.completeButton);
    }

    async startQuiz() {
        logger.info('Starting lesson quiz');
        await this.clickElement(this.selectors.takeQuizButton);
    }

    async isVideoPlayerVisible() {
        return await this.isElementDisplayed(this.selectors.videoPlayer);
    }
}

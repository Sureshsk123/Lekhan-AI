import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';

export class QuizPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            questionText: '~txt_quiz_question',
            optionPrefix: '~radio_option_', // Requires appending index (e.g., 0, 1, 2)
            submitButton: '~btn_submit_quiz'
        };
    }

    async selectAnswer(optionIndex) {
        logger.info(`Selecting quiz answer option: ${optionIndex}`);
        const optionSelector = `${this.selectors.optionPrefix}${optionIndex}`;
        await this.clickElement(optionSelector);
    }

    async submitQuiz() {
        logger.info('Submitting quiz');
        await this.clickElement(this.selectors.submitButton);
    }

    async getQuestionText() {
        return await this.getText(this.selectors.questionText);
    }
}

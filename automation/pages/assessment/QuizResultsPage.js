import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';

export class QuizResultsPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = {
            scoreDisplay: By.css('.score-display, .results-score'),
            retryButton: By.css('button:contains("Retry"), .retry-btn'),
            backToLessonsButton: By.css('button:contains("Back"), .back-btn')
        };
    }

    async getScore() {
        return await this.actions.getText(this.locators.scoreDisplay);
    }

    async retryQuiz() {
        await this.actions.click(this.locators.retryButton);
    }

    async goBackToLessons() {
        await this.actions.click(this.locators.backToLessonsButton);
    }
}

import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';

export class QuizPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = {
            questionText: By.css('.question-text, h2'),
            optionByText: (text) => By.xpath(`//label[contains(text(), '${text}')] | //button[contains(text(), '${text}')]`),
            nextButton: By.css('button:contains("Next"), .next-btn'),
            submitButton: By.css('button:contains("Submit"), .submit-btn'),
            timerDisplay: By.css('.timer')
        };
    }

    async getQuestionText() {
        return await this.actions.getText(this.locators.questionText);
    }

    async selectOption(text) {
        await this.actions.click(this.locators.optionByText(text));
    }

    async goNext() {
        await this.actions.click(this.locators.nextButton);
    }

    async submitQuiz() {
        await this.actions.click(this.locators.submitButton);
    }
}

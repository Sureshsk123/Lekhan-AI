import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';

export class LessonDetailPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = {
            lessonTitle: By.css('h1, .lesson-title'),
            lessonContent: By.css('.lesson-content, article'),
            nextButton: By.css('button:contains("Next"), .next-btn'),
            prevButton: By.css('button:contains("Previous"), .prev-btn'),
            completeButton: By.css('button:contains("Complete"), .complete-btn')
        };
    }

    async getLessonTitle() {
        return await this.actions.getText(this.locators.lessonTitle);
    }

    async goNext() {
        await this.actions.click(this.locators.nextButton);
    }

    async goPrevious() {
        await this.actions.click(this.locators.prevButton);
    }

    async completeLesson() {
        await this.actions.click(this.locators.completeButton);
    }
}

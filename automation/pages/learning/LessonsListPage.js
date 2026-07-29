import { By } from 'selenium-webdriver';
import { BasePage } from '../BasePage.js';

export class LessonsListPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.locators = {
            lessonCard: By.css('.lesson-card, .card'),
            lessonByTitle: (title) => By.xpath(`//div[contains(@class, 'card')]//h3[contains(text(), '${title}')]`),
            startLessonButton: (title) => By.xpath(`//div[contains(@class, 'card')][.//h3[contains(text(), '${title}')]]//button[contains(text(), 'Start') or contains(text(), 'Continue')]`)
        };
    }

    async getLessonCount() {
        const elements = await this.driver.findElements(this.locators.lessonCard);
        return elements.length;
    }

    async startLesson(title) {
        await this.actions.click(this.locators.startLessonButton(title));
    }
}

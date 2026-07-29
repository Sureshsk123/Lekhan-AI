import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';

export class LessonsPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            lessonsListContainer: '~list_lessons_container',
            lessonItemPrefix: 'android=new UiSelector().descriptionContains("' // For dynamic search
        };
    }

    async openLesson(lessonTitle) {
        logger.info(`Opening lesson: ${lessonTitle}`);
        
        // Native UiAutomator scroll to text implementation
        const scrollSelector = `android=new UiScrollable(new UiSelector().description("list_lessons_container")).scrollIntoView(new UiSelector().descriptionContains("${lessonTitle}"))`;
        
        try {
            const lessonEl = await this.getElement(scrollSelector);
            await lessonEl.click();
        } catch (error) {
            logger.error(`Could not find or scroll to lesson: ${lessonTitle}`);
            throw error;
        }
    }
}

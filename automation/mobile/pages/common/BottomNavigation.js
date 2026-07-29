import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';

export class BottomNavigation extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            dashboardTab: '~nav_dashboard',
            lessonsTab: '~nav_lessons',
            profileTab: '~nav_profile',
            aiTutorTab: '~nav_ai_tutor'
        };
    }

    async navigateToDashboard() {
        logger.info('Navigating to Dashboard via Bottom Nav');
        await this.clickElement(this.selectors.dashboardTab);
    }

    async navigateToLessons() {
        logger.info('Navigating to Lessons via Bottom Nav');
        await this.clickElement(this.selectors.lessonsTab);
    }

    async navigateToProfile() {
        logger.info('Navigating to Profile via Bottom Nav');
        await this.clickElement(this.selectors.profileTab);
    }

    async navigateToAITutor() {
        logger.info('Navigating to AI Tutor via Bottom Nav');
        await this.clickElement(this.selectors.aiTutorTab);
    }
}

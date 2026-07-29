import { BasePage } from '../BasePage.js';
import { logger } from '../../utilities/LoggerUtility.js';

export class DashboardPage extends BasePage {
    constructor(driver) {
        super(driver);
        this.selectors = {
            welcomeMessage: '~txt_welcome_message',
            activityWidget: '~widget_recent_activity',
            dashboardContainer: '~scrollable_dashboard'
        };
    }

    async getWelcomeMessage() {
        logger.info('Retrieving Dashboard welcome message');
        return await this.getText(this.selectors.welcomeMessage);
    }

    async refreshDashboard() {
        logger.info('Performing pull-to-refresh on dashboard');
        const container = await this.getElement(this.selectors.dashboardContainer);
        // Uses the BasePage's gesture utility to perform a native swipe down
        await this.gestures.swipeDown(container);
    }

    async isActivityWidgetVisible() {
        return await this.isElementDisplayed(this.selectors.activityWidget);
    }
}

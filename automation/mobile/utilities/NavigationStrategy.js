import { CompatibilityManager } from '../drivers/CompatibilityManager.js';
import { LoggerUtility as logger } from './LoggerUtility.js';
import { BottomNavigation } from '../pages/common/BottomNavigation.js';
import { SideDrawer } from '../pages/common/SideDrawer.js';
import { DashboardPage } from '../pages/dashboard/DashboardPage.js';

/**
 * Strategy definitions for Navigation.
 * Provides granular paths that NavigationManager can cascade through.
 */
export class NavigationStrategy {
    constructor(driver) {
        this.driver = driver;
        this.bottomNav = new BottomNavigation(driver);
        this.sideDrawer = new SideDrawer(driver);
        this.dashboardPage = new DashboardPage(driver);
    }

    /**
     * O(1) Instant Navigation via Android App Links/Custom URI
     * @param {string} deepLinkUrl - e.g., 'lekhanapp://lesson/101'
     */
    async executeDeepLinkStrategy(deepLinkUrl) {
        logger.info(`[STRATEGY] Attempting Deep Link: ${deepLinkUrl}`);
        try {
            await this.compatibilityManager.openDeepLink(deepLinkUrl, 'ai.lekhan.app' // Fallback if config isn't loaded
            );
            return true;
        } catch (error) {
            logger.warn(`[STRATEGY] Deep Link failed: ${error.message}`);
            return false;
        }
    }

    /**
     * Traversal via Bottom Tab Navigation
     * @param {string} tabName - 'Dashboard', 'Lessons', 'Profile', 'AITutor'
     */
    async executeBottomNavStrategy(tabName) {
        logger.info(`[STRATEGY] Attempting Bottom Nav: ${tabName}`);
        try {
            switch (tabName) {
                case 'Dashboard':
                    await this.bottomNav.navigateToDashboard();
                    break;
                case 'Lessons':
                    await this.bottomNav.navigateToLessons();
                    break;
                case 'Profile':
                    await this.bottomNav.navigateToProfile();
                    break;
                case 'AITutor':
                    await this.bottomNav.navigateToAITutor();
                    break;
                default:
                    throw new Error(`Unknown bottom tab: ${tabName}`);
            }
            return true;
        } catch (error) {
            logger.warn(`[STRATEGY] Bottom Nav failed: ${error.message}`);
            return false;
        }
    }

    /**
     * Traversal via Side Drawer (Hamburger Menu)
     * @param {string} menuItem - 'Settings', 'Logout'
     */
    async executeDrawerStrategy(menuItem) {
        logger.info(`[STRATEGY] Attempting Drawer Nav: ${menuItem}`);
        try {
            await this.sideDrawer.openDrawer();
            switch (menuItem) {
                case 'Settings':
                    await this.sideDrawer.navigateToSettings();
                    break;
                case 'Logout':
                    await this.sideDrawer.logout();
                    break;
                default:
                    throw new Error(`Unknown drawer item: ${menuItem}`);
            }
            return true;
        } catch (error) {
            logger.warn(`[STRATEGY] Drawer Nav failed: ${error.message}`);
            return false;
        }
    }

    /**
     * Ultimate Fallback: Reset to Dashboard by pressing back, then attempt UI flow
     */
    async executeFallbackUIStrategy() {
        logger.info(`[STRATEGY] Attempting UI Fallback to Dashboard`);
        try {
            // Attempt to hammer the back button until Dashboard is visible
            let isDashboard = await this.dashboardPage.isElementDisplayed(this.dashboardPage.selectors.welcomeMessage);
            let attempts = 0;
            while (!isDashboard && attempts < 5) {
                await this.driver.back();
                // Brief pause to allow OS animation
                await this.driver.pause(500);
                isDashboard = await this.dashboardPage.isElementDisplayed(this.dashboardPage.selectors.welcomeMessage);
                attempts++;
            }
            return isDashboard;
        } catch (error) {
            logger.error(`[STRATEGY] UI Fallback failed catastrophically: ${error.message}`);
            return false;
        }
    }
}

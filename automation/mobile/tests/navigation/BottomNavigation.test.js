import assert from 'assert';
import { LoginPage } from '../../pages/authentication/LoginPage.js';
import { DashboardPage } from '../../pages/dashboard/DashboardPage.js';
import { LessonsPage } from '../../pages/learning/LessonsPage.js';
import { ProfilePage } from '../../pages/settings/ProfilePage.js';
import { AITutorPage } from '../../pages/hardware/AITutorPage.js';
import { BottomNavigation } from '../../pages/common/BottomNavigation.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';

describe('Mobile Navigation: Bottom Navigation Suite', function () {
    let loginPage;
    let dashboardPage;
    let lessonsPage;
    let profilePage;
    let aiTutorPage;
    let bottomNav;
    let compatibilityManager;

    before(async function () {
        loginPage = new LoginPage(global.driver);
        dashboardPage = new DashboardPage(global.driver);
        lessonsPage = new LessonsPage(global.driver);
        profilePage = new ProfilePage(global.driver);
        aiTutorPage = new AITutorPage(global.driver);
        bottomNav = new BottomNavigation(global.driver);
        compatibilityManager = new CompatibilityManager(global.driver);
        await compatibilityManager.initialize();
    });

    beforeEach(async function () {
        logger.info(`Starting Test: ${this.currentTest.title}`);
        // Ensure user is logged in and on Dashboard before each navigation test
        await loginPage.login('student@lekhan.ai', 'ValidPass123!');
        await dashboardPage.isActivityWidgetVisible();
    });

    afterEach(async function () {
        if (this.currentTest.state === 'failed') {
            await ScreenshotUtility.captureFailure(global.driver, this.currentTest.title);
        }
        await compatibilityManager.resetApp();
    });

    it('should navigate to Lessons tab successfully', async function () {
        await bottomNav.navigateToLessons();
        const isVisible = await lessonsPage.isElementDisplayed(lessonsPage.selectors.lessonsListContainer);
        assert.ok(isVisible, 'Did not route to Lessons tab');
    });

    it('should navigate to Profile tab successfully', async function () {
        await bottomNav.navigateToProfile();
        const isVisible = await profilePage.isElementDisplayed(profilePage.selectors.profileAvatar);
        assert.ok(isVisible, 'Did not route to Profile tab');
    });

    it('should navigate to AI Tutor tab successfully', async function () {
        await bottomNav.navigateToAITutor();
        const isVisible = await aiTutorPage.isElementDisplayed(aiTutorPage.selectors.chatInput);
        assert.ok(isVisible, 'Did not route to AI Tutor tab');
    });

    it('should return to Dashboard from another tab', async function () {
        await bottomNav.navigateToLessons();
        await bottomNav.navigateToDashboard();
        
        const isVisible = await dashboardPage.isElementDisplayed(dashboardPage.selectors.welcomeMessage);
        assert.ok(isVisible, 'Did not route back to Dashboard tab');
    });

    it('should persist tab state when backgrounded', async function () {
        await bottomNav.navigateToLessons();
        
        logger.info('Backgrounding app for 3 seconds');
        await compatibilityManager.backgroundApp(3);
        
        logger.info('App resumed. Verifying persistence.');
        const isVisible = await lessonsPage.isElementDisplayed(lessonsPage.selectors.lessonsListContainer);
        assert.ok(isVisible, 'App lost tab state after resuming from background');
    });
});

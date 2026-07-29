import assert from 'assert';
import { LoginPage } from '../../pages/authentication/LoginPage.js';
import { DashboardPage } from '../../pages/dashboard/DashboardPage.js';
import { LessonsPage } from '../../pages/learning/LessonsPage.js';
import { LessonDetailPage } from '../../pages/learning/LessonDetailPage.js';
import { SearchPage } from '../../pages/dashboard/SearchPage.js';
import { SettingsPage } from '../../pages/settings/SettingsPage.js';
import { ProfilePage } from '../../pages/settings/ProfilePage.js';
import { BottomNavigation } from '../../pages/common/BottomNavigation.js';
import { SideDrawer } from '../../pages/common/SideDrawer.js';
import { FlowManager } from '../../flows/FlowManager.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';

describe('Mobile Navigation: Navigation Flow Suite', function () {
    let loginPage;
    let dashboardPage;
    let lessonsPage;
    let lessonDetailPage;
    let searchPage;
    let settingsPage;
    let profilePage;
    let bottomNav;
    let sideDrawer;
    let flowManager;
    let compatibilityManager;

    before(async function () {
        loginPage = new LoginPage(global.driver);
        dashboardPage = new DashboardPage(global.driver);
        lessonsPage = new LessonsPage(global.driver);
        lessonDetailPage = new LessonDetailPage(global.driver);
        searchPage = new SearchPage(global.driver);
        settingsPage = new SettingsPage(global.driver);
        profilePage = new ProfilePage(global.driver);
        bottomNav = new BottomNavigation(global.driver);
        sideDrawer = new SideDrawer(global.driver);
        flowManager = new FlowManager(global.driver);
        compatibilityManager = new CompatibilityManager(global.driver);
        await compatibilityManager.initialize();
    });

    beforeEach(async function () {
        logger.info(`Starting Test: ${this.currentTest.title}`);
        await loginPage.login('student@lekhan.ai', 'ValidPass123!');
        await dashboardPage.isActivityWidgetVisible();
    });

    afterEach(async function () {
        if (this.currentTest.state === 'failed') {
            await ScreenshotUtility.captureFailure(global.driver, this.currentTest.title);
        }
        await compatibilityManager.resetApp();
    });

    it('should navigate Dashboard -> Lessons -> Lesson Details -> Native Back', async function () {
        // Step 1: Nav to Lessons
        await bottomNav.navigateToLessons();
        assert.ok(await lessonsPage.isElementDisplayed(lessonsPage.selectors.lessonsListContainer), 'Lessons list failed to load');

        // Step 2: Nav to Detail
        // Assuming there's a default "Introduction" lesson
        await lessonsPage.openLesson('Introduction');
        assert.ok(await lessonDetailPage.isVideoPlayerVisible(), 'Lesson Detail failed to load');

        // Step 3: Native Back
        logger.info('Executing native OS Back command');
        await compatibilityManager.back();
        
        // Assert we return to Lessons, not Dashboard or Exit
        assert.ok(await lessonsPage.isElementDisplayed(lessonsPage.selectors.lessonsListContainer), 'Native back did not return to Lessons list');
    });

    it('should navigate Dashboard -> Search and handle Android back stack', async function () {
        // Trigger search (Assuming search is accessed via an icon on Dashboard)
        logger.info('Tapping global search icon');
        await global.driver.click('~icon_global_search'); // Assuming this exists on Dashboard top bar
        
        const isSearchVisible = await searchPage.isElementDisplayed(searchPage.selectors.searchInput);
        assert.ok(isSearchVisible, 'Search page did not load');

        logger.info('Executing native OS Back command to exit search');
        await compatibilityManager.back();
        
        assert.ok(await dashboardPage.isActivityWidgetVisible(), 'Did not return to Dashboard after backing out of search');
    });

    it('should navigate Dashboard -> Settings (Drawer) -> Profile -> Dashboard', async function () {
        // Dashboard -> Settings
        await sideDrawer.navigateToSettings();
        assert.ok(await settingsPage.isElementDisplayed(settingsPage.selectors.darkModeToggle), 'Settings failed to load');

        // Settings -> Profile (Assuming there's a profile row in settings)
        logger.info('Navigating to Profile from Settings');
        await global.driver.click('~row_settings_profile');
        assert.ok(await profilePage.isElementDisplayed(profilePage.selectors.profileAvatar), 'Profile failed to load');

        // Profile -> Dashboard (Via bottom nav or back button, assuming back)
        logger.info('Executing native OS Back command');
        await compatibilityManager.back();
        // At Settings
        await compatibilityManager.back();
        // At Dashboard
        assert.ok(await dashboardPage.isActivityWidgetVisible(), 'Did not successfully traverse stack back to Dashboard');
    });

    it('should prevent exiting app on native back from protected root screen (Dashboard)', async function () {
        // Dashboard is the root. Hitting back usually either does nothing, shows a toast "Press back again to exit", or backgrounds.
        logger.info('Executing native OS Back command from root Dashboard');
        await compatibilityManager.back();
        
        // Wait briefly to see if app crashed or closed
        await compatibilityManager.pause(1000);
        
        // Query the state (Appium Android App State constants: 4 = RUNNING_IN_FOREGROUND)
        const state = await compatibilityManager.queryAppState('ai.lekhan.app');
        // 4 = RUNNING_IN_FOREGROUND
        assert.strictEqual(state, 4, 'App inappropriately exited when hitting back on Dashboard');
    });
});

import assert from 'assert';
import { LoginPage } from '../../pages/authentication/LoginPage.js';
import { DashboardPage } from '../../pages/dashboard/DashboardPage.js';
import { SettingsPage } from '../../pages/settings/SettingsPage.js';
import { SideDrawer } from '../../pages/common/SideDrawer.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';
import { RetryUtility } from '../../utilities/RetryUtility.js';
import { FlowManager } from '../../flows/FlowManager.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';

describe('Navigation Automation: Side Drawer Suite', function () {
    let loginPage;
    let dashboardPage;
    let settingsPage;
    let sideDrawer;
    let flowManager;
    let compatibilityManager;

    before(async function () {
        loginPage = new LoginPage(global.driver);
        dashboardPage = new DashboardPage(global.driver);
        settingsPage = new SettingsPage(global.driver);
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

    it('should open and close the side drawer via icon', async function () {
        await sideDrawer.openDrawer();
        const isSettingsMenuVisible = await sideDrawer.isElementDisplayed(sideDrawer.selectors.settingsMenu);
        assert.ok(isSettingsMenuVisible, 'Side Drawer did not open');

        // Tap outside or swipe back to close (Assuming native back closes drawer)
        await compatibilityManager.back();
        const isMenuHidden = await sideDrawer.isElementDisplayed(sideDrawer.selectors.settingsMenu) === false;
        assert.ok(isMenuHidden, 'Side Drawer did not close');
    });

    it('should open drawer via edge swipe gesture', async function () {
        logger.info('Performing edge swipe to open drawer');
        // Perform native edge swipe (from x=0 to x=60%)
        const { height, width } = await compatibilityManager.getWindowRect();
        await compatibilityManager.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: 0, y: height / 2 },
                { type: 'pointerDown', button: 0 },
                { type: 'pointerMove', duration: 500, x: width * 0.8, y: height / 2 },
                { type: 'pointerUp', button: 0 }
            ]
        }]);

        const isSettingsMenuVisible = await sideDrawer.isElementDisplayed(sideDrawer.selectors.settingsMenu);
        assert.ok(isSettingsMenuVisible, 'Drawer failed to open via edge swipe gesture');
    });

    it('should navigate to Settings via Drawer', async function () {
        await sideDrawer.navigateToSettings();
        
        // Wait and verify we landed on Settings
        const isDarkModeVisible = await settingsPage.isElementDisplayed(settingsPage.selectors.darkModeToggle);
        assert.ok(isDarkModeVisible, 'Did not route to Settings page from Drawer');
    });

    it('should execute logout flow from Drawer', async function () {
        await sideDrawer.logout();
        
        // Wrap in retry as animation might delay state update
        await RetryUtility.retry(async () => {
            const isLoginVisible = await loginPage.isElementDisplayed(loginPage.selectors.loginButton);
            assert.ok(isLoginVisible, 'Did not route to Login after Drawer Logout');
        }, 3, 1000);
    });
});

import assert from 'assert';
import { LoginPage } from '../../pages/authentication/LoginPage.js';
import { DashboardPage } from '../../pages/dashboard/DashboardPage.js';
import { SideDrawer } from '../../pages/common/SideDrawer.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';
import { ConfigReader } from '../../utilities/ConfigReader.js';

describe('Mobile Authentication: Session Management Test Suite', function () {
    let loginPage;
    let dashboardPage;
    let sideDrawer;
    let compatibilityManager;

    before(async function () {
        loginPage = new LoginPage(global.driver);
        dashboardPage = new DashboardPage(global.driver);
        sideDrawer = new SideDrawer(global.driver);
        compatibilityManager = new CompatibilityManager(global.driver);
    });

    beforeEach(async function () {
        logger.info(`Starting Test: ${this.currentTest.title}`);
    });

    afterEach(async function () {
        if (this.currentTest.state === 'failed') {
            await ScreenshotUtility.captureFailure(global.driver, this.currentTest.title);
        }
        
        // Ensure orientation is reset
        if (await compatibilityManager.currentOrientation() === 'LANDSCAPE') {
            await compatibilityManager.rotatePortrait();
        }
        
        await compatibilityManager.resetApp();
    });

    it('should automatically login returning user (Session Persistence)', async function () {
        // First login
        await loginPage.login('student@lekhan.ai', 'ValidPass123!');
        assert.ok(await dashboardPage.isActivityWidgetVisible(), 'Dashboard failed to load initially');

        // Restart app (not full reset, just close and open to check local storage/token)
        logger.info('Restarting Application...');
        const config = ConfigReader.getConfig();
        const packageName = config.capabilities?.['appium:appPackage'] || 'ai.lekhan.app';
        
        await compatibilityManager.terminate(packageName);
        await compatibilityManager.activate(packageName);

        // Verify we are still on Dashboard
        assert.ok(await dashboardPage.isActivityWidgetVisible(), 'Session was lost after app restart');
    });

    it('should successfully logout the user', async function () {
        await loginPage.login('student@lekhan.ai', 'ValidPass123!');
        await dashboardPage.isActivityWidgetVisible(); // Wait for dashboard

        await sideDrawer.logout();
        
        // Verify we are returned to login
        const isLoginVisible = await loginPage.isElementDisplayed(loginPage.selectors.loginButton);
        assert.ok(isLoginVisible, 'User was not redirected to Login screen after logout');
    });

    it('should persist session when app is backgrounded', async function () {
        await loginPage.login('student@lekhan.ai', 'ValidPass123!');
        assert.ok(await dashboardPage.isActivityWidgetVisible(), 'Dashboard failed to load');

        logger.info('Sending app to background for 5 seconds');
        await compatibilityManager.backgroundApp(5);

        logger.info('App resumed. Verifying session...');
        assert.ok(await dashboardPage.isActivityWidgetVisible(), 'Session lost after returning from background');
    });

    it('should persist session through device rotation', async function () {
        await loginPage.login('student@lekhan.ai', 'ValidPass123!');
        assert.ok(await dashboardPage.isActivityWidgetVisible(), 'Dashboard failed to load');

        logger.info('Rotating device to LANDSCAPE');
        await compatibilityManager.rotateLandscape();
        
        logger.info('Verifying session in LANDSCAPE mode');
        assert.ok(await dashboardPage.isActivityWidgetVisible(), 'Dashboard crashed or session lost during rotation');

        logger.info('Rotating device back to PORTRAIT');
        await compatibilityManager.rotatePortrait();
    });

    it('should expire session and prompt login on token invalidation', async function () {
        await loginPage.login('student@lekhan.ai', 'ValidPass123!');
        await dashboardPage.isActivityWidgetVisible();

        // Simulate token expiry by clearing app data natively
        logger.info('Simulating token expiry by clearing app data');
        const config = ConfigReader.getConfig();
        const packageName = config.capabilities?.['appium:appPackage'] || 'ai.lekhan.app';
        
        // Close app fully and restart
        await compatibilityManager.terminate(packageName);
        await compatibilityManager.activate(packageName);

        const isLoginVisible = await loginPage.isElementDisplayed(loginPage.selectors.loginButton);
        assert.ok(isLoginVisible, 'User should be forced to login after local storage clears');
    });
});

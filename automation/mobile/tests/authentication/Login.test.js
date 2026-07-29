import assert from 'assert';
import { LoginPage } from '../../pages/authentication/LoginPage.js';
import { DashboardPage } from '../../pages/dashboard/DashboardPage.js';
import { Toast } from '../../pages/common/Toast.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';

// Assuming global Appium hook attaches `global.driver` in `BaseTest.js`
describe('Mobile Authentication: Login Test Suite', function () {
    let compatibilityManager;
    let loginPage;
    let dashboardPage;
    let toast;

    before(async function () {
        compatibilityManager = new CompatibilityManager(global.driver);
        await compatibilityManager.initialize();
        loginPage = new LoginPage(global.driver);
        dashboardPage = new DashboardPage(global.driver);
        toast = new Toast(global.driver);
    });

    beforeEach(async function () {
        logger.info(`Starting Test: ${this.currentTest.title}`);
    });

    afterEach(async function () {
        if (this.currentTest.state === 'failed') {
            logger.error(`Test Failed: ${this.currentTest.title}`);
            await ScreenshotUtility.captureFailure(global.driver, this.currentTest.title);
        }
        // Native mobile back or app restart to reset state between tests
        await compatibilityManager.resetApp();
    });

    it('should login successfully with valid credentials', async function () {
        await loginPage.login('student@lekhan.ai', 'ValidPass123!');
        const welcomeText = await dashboardPage.getWelcomeMessage();
        assert.ok(welcomeText.includes('Welcome'), 'Dashboard did not load after valid login');
    });

    it('should display error toast for invalid username', async function () {
        await loginPage.login('invalid@lekhan.ai', 'ValidPass123!');
        const errorMessage = await toast.getToastMessage();
        assert.strictEqual(errorMessage, 'Invalid credentials');
    });

    it('should display error toast for invalid password', async function () {
        await loginPage.login('student@lekhan.ai', 'WrongPassword!');
        const errorMessage = await toast.getToastMessage();
        assert.strictEqual(errorMessage, 'Invalid credentials');
    });

    it('should validate empty username field', async function () {
        await loginPage.login('', 'ValidPass123!');
        const errorMessage = await toast.getToastMessage();
        assert.strictEqual(errorMessage, 'Email is required');
    });

    it('should validate empty password field', async function () {
        await loginPage.login('student@lekhan.ai', '');
        const errorMessage = await toast.getToastMessage();
        assert.strictEqual(errorMessage, 'Password is required');
    });

    it('should validate empty credentials', async function () {
        await loginPage.login('', '');
        const errorMessage = await toast.getToastMessage();
        assert.ok(['Email is required', 'Credentials required'].includes(errorMessage));
    });

    it('should handle trimmed input gracefully', async function () {
        await loginPage.login(' student@lekhan.ai ', ' ValidPass123! ');
        const welcomeText = await dashboardPage.getWelcomeMessage();
        assert.ok(welcomeText.includes('Welcome'), 'Dashboard failed on trailing spaces');
    });

    it('should block special characters in username', async function () {
        await loginPage.login('stu*dent#@lekhan.ai', 'ValidPass123!');
        const errorMessage = await toast.getToastMessage();
        assert.strictEqual(errorMessage, 'Invalid email format');
    });

    it('should prevent SQL Injection strings in password', async function () {
        await loginPage.login('student@lekhan.ai', "' OR 1=1--");
        const errorMessage = await toast.getToastMessage();
        assert.strictEqual(errorMessage, 'Invalid credentials');
    });

    it('should prevent XSS Payloads in username', async function () {
        await loginPage.login("<script>alert(1)</script>@lekhan.ai", "Password123!");
        const errorMessage = await toast.getToastMessage();
        assert.strictEqual(errorMessage, 'Invalid email format');
    });

    it('should enforce maximum length boundaries', async function () {
        const longEmail = 'a'.repeat(250) + '@lekhan.ai';
        await loginPage.login(longEmail, 'Password123!');
        const errorMessage = await toast.getToastMessage();
        assert.strictEqual(errorMessage, 'Email exceeds maximum length');
    });

    it('should enforce minimum length boundaries', async function () {
        await loginPage.login('a@b.c', 'pwd');
        const errorMessage = await toast.getToastMessage();
        assert.ok(['Invalid email format', 'Password too short'].includes(errorMessage));
    });
});

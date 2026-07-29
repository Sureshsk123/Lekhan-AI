import assert from 'assert';
import { RegisterPage } from '../../pages/authentication/RegisterPage.js';
import { DashboardPage } from '../../pages/dashboard/DashboardPage.js';
import { Toast } from '../../pages/common/Toast.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';

describe('Mobile Authentication: Registration Test Suite', function () {
    let compatibilityManager;
    let registerPage;
    let dashboardPage;
    let toast;

    before(async function () {
        compatibilityManager = new CompatibilityManager(global.driver);
        await compatibilityManager.initialize();
        registerPage = new RegisterPage(global.driver);
        dashboardPage = new DashboardPage(global.driver);
        toast = new Toast(global.driver);
    });

    beforeEach(async function () {
        logger.info(`Starting Test: ${this.currentTest.title}`);
        // Navigate to register screen from splash/login (handled by beforeEach hook usually)
    });

    afterEach(async function () {
        if (this.currentTest.state === 'failed') {
            await ScreenshotUtility.captureFailure(global.driver, this.currentTest.title);
        }
        await compatibilityManager.resetApp();
    });

    it('should register successfully with valid data', async function () {
        const uniqueEmail = `newuser_${Date.now()}@lekhan.ai`;
        await registerPage.registerUser('Test Student', uniqueEmail, 'SecurePass123!');
        
        const welcomeText = await dashboardPage.getWelcomeMessage();
        assert.ok(welcomeText.includes('Welcome'), 'Auto-login failed after registration');
    });

    it('should block duplicate email registration', async function () {
        await registerPage.registerUser('Existing Student', 'student@lekhan.ai', 'SecurePass123!');
        const errorMessage = await toast.getToastMessage();
        assert.strictEqual(errorMessage, 'Email already in use');
    });

    it('should block invalid email formats', async function () {
        await registerPage.registerUser('Bad Email', 'student@invalid', 'SecurePass123!');
        const errorMessage = await toast.getToastMessage();
        assert.strictEqual(errorMessage, 'Invalid email format');
    });

    it('should block weak passwords', async function () {
        await registerPage.registerUser('Weak Pass', `user_${Date.now()}@lekhan.ai`, '123');
        const errorMessage = await toast.getToastMessage();
        assert.strictEqual(errorMessage, 'Password must be at least 8 characters');
    });

    it('should block submission if required fields are missing', async function () {
        await registerPage.registerUser('', '', '');
        const errorMessage = await toast.getToastMessage();
        assert.strictEqual(errorMessage, 'Please fill in all required fields');
    });

    it('should enforce boundary values on name field', async function () {
        const longName = 'A'.repeat(100);
        await registerPage.registerUser(longName, `user_${Date.now()}@lekhan.ai`, 'SecurePass123!');
        const errorMessage = await toast.getToastMessage();
        assert.strictEqual(errorMessage, 'Name exceeds maximum length');
    });
});

import assert from 'assert';
import { ForgotPasswordPage } from '../../pages/authentication/ForgotPasswordPage.js';
import { Toast } from '../../pages/common/Toast.js';
import { LoggerUtility as logger } from '../../utilities/LoggerUtility.js';
import { ScreenshotUtility } from '../../utilities/ScreenshotUtility.js';
import { CompatibilityManager } from '../../drivers/CompatibilityManager.js';

describe('Mobile Authentication: Forgot Password Test Suite', function () {
    let compatibilityManager;
    let forgotPasswordPage;
    let toast;

    before(async function () {
        compatibilityManager = new CompatibilityManager(global.driver);
        await compatibilityManager.initialize();
        forgotPasswordPage = new ForgotPasswordPage(global.driver);
        toast = new Toast(global.driver);
    });

    beforeEach(async function () {
        logger.info(`Starting Test: ${this.currentTest.title}`);
        // Assume navigation to Forgot Password screen handled
    });

    afterEach(async function () {
        if (this.currentTest.state === 'failed') {
            await ScreenshotUtility.captureFailure(global.driver, this.currentTest.title);
        }
        await compatibilityManager.resetApp();
    });

    it('should send reset link for existing email', async function () {
        await forgotPasswordPage.requestPasswordReset('student@lekhan.ai');
        const successMessage = await toast.getToastMessage();
        assert.strictEqual(successMessage, 'Password reset link sent to your email');
    });

    it('should display error for non-existing email', async function () {
        await forgotPasswordPage.requestPasswordReset('doesnotexist@lekhan.ai');
        const errorMessage = await toast.getToastMessage();
        assert.strictEqual(errorMessage, 'User not found');
    });

    it('should block invalid email format', async function () {
        await forgotPasswordPage.requestPasswordReset('invalid_email_format');
        const errorMessage = await toast.getToastMessage();
        assert.strictEqual(errorMessage, 'Invalid email format');
    });

    it('should block empty email submission', async function () {
        await forgotPasswordPage.requestPasswordReset('');
        const errorMessage = await toast.getToastMessage();
        assert.strictEqual(errorMessage, 'Email is required');
    });
});

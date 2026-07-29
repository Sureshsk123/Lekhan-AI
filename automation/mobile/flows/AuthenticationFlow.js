import { LoginPage } from '../pages/authentication/LoginPage.js';
import { RegisterPage } from '../pages/authentication/RegisterPage.js';
import { ForgotPasswordPage } from '../pages/authentication/ForgotPasswordPage.js';
import { LoggerUtility as logger } from '../utilities/LoggerUtility.js';
import { RetryUtility } from '../utilities/RetryUtility.js';
import { ScreenshotUtility } from '../utilities/ScreenshotUtility.js';

export class AuthenticationFlow {
    /**
     * @param {object} driver - Appium driver instance
     * @param {NavigationManager} navManager - Thread-local navigation router
     * @param {FlowContext} context - Thread-local flow state
     */
    constructor(driver, navManager, context) {
        this.driver = driver;
        this.navManager = navManager;
        this.context = context;

        this.loginPage = new LoginPage(driver);
        this.registerPage = new RegisterPage(driver);
        this.forgotPasswordPage = new ForgotPasswordPage(driver);
    }

    async login(user) {
        this.context.startFlow('AuthenticationFlow.login');
        logger.info(`[Flow] Executing Login for user: ${user.email}`);
        
        try {
            if (this.context.isAuthenticated() && this.context.getCurrentUser()?.email === user.email) {
                logger.info('[Flow] User is already logged in. Skipping login step.');
                this.context.completeFlow('AuthenticationFlow.login');
                return;
            }

            // Ensure we are on Login Screen
            await this.navManager.logout(); 

            await RetryUtility.retry(async () => {
                await this.loginPage.login(user.email, user.password);
            }, 2, 2000);

            // Verify landing on Dashboard implicitly sets auth state
            await this.navManager.gotoDashboard();

            this.context.setAuthenticated(user);
            this.context.completeFlow('AuthenticationFlow.login');
            logger.info('[Flow] Login flow completed successfully.');
        } catch (error) {
            await ScreenshotUtility.captureFailure(this.driver, 'Flow_Login_Failed');
            logger.error(`[Flow] Login failed: ${error.message}`);
            throw new Error(`AuthenticationFlow.login failed: ${error.message}`);
        }
    }

    async register(user) {
        this.context.startFlow('AuthenticationFlow.register');
        logger.info(`[Flow] Executing Registration for user: ${user.email}`);

        try {
            await this.navManager.logout(); // Navigate to Login
            await this.loginPage.navigateToRegister();

            await RetryUtility.retry(async () => {
                await this.registerPage.registerUser(user.name, user.email, user.password);
            }, 2, 2000);

            // Assuming successful registration drops user on Dashboard
            await this.navManager.gotoDashboard();

            this.context.setAuthenticated(user);
            this.context.completeFlow('AuthenticationFlow.register');
            logger.info('[Flow] Registration flow completed successfully.');
        } catch (error) {
            await ScreenshotUtility.captureFailure(this.driver, 'Flow_Register_Failed');
            logger.error(`[Flow] Registration failed: ${error.message}`);
            throw new Error(`AuthenticationFlow.register failed: ${error.message}`);
        }
    }

    async forgotPassword(email) {
        this.context.startFlow('AuthenticationFlow.forgotPassword');
        logger.info(`[Flow] Executing Forgot Password for email: ${email}`);

        try {
            await this.navManager.logout();
            await this.loginPage.navigateToForgotPassword();

            await RetryUtility.retry(async () => {
                await this.forgotPasswordPage.requestPasswordReset(email);
            }, 2, 2000);

            this.context.completeFlow('AuthenticationFlow.forgotPassword');
            logger.info('[Flow] Forgot Password flow completed successfully.');
        } catch (error) {
            await ScreenshotUtility.captureFailure(this.driver, 'Flow_ForgotPassword_Failed');
            logger.error(`[Flow] Forgot Password failed: ${error.message}`);
            throw new Error(`AuthenticationFlow.forgotPassword failed: ${error.message}`);
        }
    }

    async logout() {
        this.context.startFlow('AuthenticationFlow.logout');
        logger.info('[Flow] Executing Logout flow');

        try {
            await this.navManager.logout();
            this.context.setLoggedOut();
            
            this.context.completeFlow('AuthenticationFlow.logout');
            logger.info('[Flow] Logout flow completed successfully.');
        } catch (error) {
            await ScreenshotUtility.captureFailure(this.driver, 'Flow_Logout_Failed');
            logger.error(`[Flow] Logout failed: ${error.message}`);
            throw new Error(`AuthenticationFlow.logout failed: ${error.message}`);
        }
    }
}

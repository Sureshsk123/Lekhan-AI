import { LoggerUtility as logger } from './LoggerUtility.js';
import { NavigationCache } from './NavigationCache.js';
import { NavigationStrategy } from './NavigationStrategy.js';

// Import Pages for Physical Verification only
import { DashboardPage } from '../pages/dashboard/DashboardPage.js';
import { LessonsPage } from '../pages/learning/LessonsPage.js';
import { LessonDetailPage } from '../pages/learning/LessonDetailPage.js';
import { ProfilePage } from '../pages/settings/ProfilePage.js';
import { SettingsPage } from '../pages/settings/SettingsPage.js';
import { AITutorPage } from '../pages/hardware/AITutorPage.js';
import { OCRPage } from '../pages/hardware/OCRPage.js';
import { LoginPage } from '../pages/authentication/LoginPage.js';

export class NavigationManager {
    constructor(driver) {
        this.driver = driver;
        this.cache = new NavigationCache();
        this.strategy = new NavigationStrategy(driver);

        // Instantiate Pages for Verification
        this.dashboardPage = new DashboardPage(driver);
        this.lessonsPage = new LessonsPage(driver);
        this.lessonDetailPage = new LessonDetailPage(driver);
        this.profilePage = new ProfilePage(driver);
        this.settingsPage = new SettingsPage(driver);
        this.aiTutorPage = new AITutorPage(driver);
        this.ocrPage = new OCRPage(driver);
        this.loginPage = new LoginPage(driver);
    }

    /**
     * Core router method implementing Fallback logic
     */
    async _route(targetScreen, targetMetadata = {}, executionFlow = []) {
        const startTime = Date.now();
        
        logger.info(`[NavigationManager] Request to route to: ${targetScreen}`);

        // 1. CACHE CHECK
        if (this.cache.isAlreadyOnScreen(targetScreen, targetMetadata)) {
            logger.info(`[NavigationManager] Cache hit. Already on ${targetScreen}.`);
            return;
        }

        let success = false;
        let finalStrategyUsed = 'None';

        // 2. STRATEGY CASCADE
        for (const step of executionFlow) {
            if (step.type === 'DeepLink') {
                success = await this.strategy.executeDeepLinkStrategy(step.payload);
                if (success) {
                    finalStrategyUsed = 'DeepLink';
                    break;
                }
            }
            if (step.type === 'BottomNav') {
                success = await this.strategy.executeBottomNavStrategy(step.payload);
                if (success) {
                    finalStrategyUsed = 'BottomNav';
                    break;
                }
            }
            if (step.type === 'Drawer') {
                success = await this.strategy.executeDrawerStrategy(step.payload);
                if (success) {
                    finalStrategyUsed = 'Drawer';
                    break;
                }
            }
            if (step.type === 'UI') {
                success = await this.strategy.executeFallbackUIStrategy();
                if (success) {
                    finalStrategyUsed = 'UIFallback';
                    break;
                }
            }
        }

        if (!success) {
            throw new Error(`[NavigationManager] Failed to route to ${targetScreen} after trying all strategies.`);
        }

        // 3. PHYSICAL VERIFICATION
        // (Trust but verify the strategy actually worked)
        await this._verifyPhysicalState(targetScreen);

        // 4. CACHE UPDATE & LOGGING
        this.cache.updateCurrentScreen(targetScreen, targetMetadata);
        const duration = Date.now() - startTime;
        logger.info(`[NavigationManager] Successfully routed to ${targetScreen} via ${finalStrategyUsed} in ${duration}ms`);
    }

    async _verifyPhysicalState(screen) {
        let isVisible = false;
        switch(screen) {
            case 'Dashboard':
                isVisible = await this.dashboardPage.isElementDisplayed(this.dashboardPage.selectors.welcomeMessage);
                break;
            case 'Lessons':
                isVisible = await this.lessonsPage.isElementDisplayed(this.lessonsPage.selectors.lessonsListContainer);
                break;
            case 'LessonDetail':
                isVisible = await this.lessonDetailPage.isVideoPlayerVisible();
                break;
            case 'Profile':
                isVisible = await this.profilePage.isElementDisplayed(this.profilePage.selectors.profileAvatar);
                break;
            case 'Settings':
                isVisible = await this.settingsPage.isElementDisplayed(this.settingsPage.selectors.darkModeToggle);
                break;
            case 'AITutor':
                isVisible = await this.aiTutorPage.isElementDisplayed(this.aiTutorPage.selectors.chatInput);
                break;
            case 'OCR':
                isVisible = await this.ocrPage.isElementDisplayed(this.ocrPage.selectors.openCameraButton);
                break;
            case 'Login':
                isVisible = await this.loginPage.isElementDisplayed(this.loginPage.selectors.loginButton);
                break;
        }
        if (!isVisible) {
            throw new Error(`[NavigationManager] Physical verification failed for screen: ${screen}`);
        }
    }

    // ==========================================
    // BUSINESS API METHODS
    // ==========================================

    async gotoDashboard() {
        await this._route('Dashboard', {}, [
            { type: 'DeepLink', payload: 'lekhanapp://dashboard' },
            { type: 'BottomNav', payload: 'Dashboard' },
            { type: 'UI', payload: null }
        ]);
    }

    async gotoLessons() {
        await this._route('Lessons', {}, [
            { type: 'DeepLink', payload: 'lekhanapp://lessons' },
            { type: 'BottomNav', payload: 'Lessons' },
            { type: 'UI', payload: null }
        ]);
    }

    async gotoLesson(lessonName) {
        // Deep linking is vastly superior for nested fragments
        const formattedName = lessonName.replace(/\s+/g, '').toLowerCase(); // e.g. "Lesson 5" -> "lesson5"
        
        await this._route('LessonDetail', { lessonName }, [
            { type: 'DeepLink', payload: `lekhanapp://lesson/${formattedName}` },
            { type: 'BottomNav', payload: 'Lessons' } // Falls back to Lessons page where manual UI traversal would take over
        ]);

        // If DeepLink failed, we landed on Lessons page. We must manually open it.
        if (this.cache.getCurrentScreen() === 'Lessons') {
            await this.lessonsPage.openLesson(lessonName);
            await this._verifyPhysicalState('LessonDetail');
            this.cache.updateCurrentScreen('LessonDetail', { lessonName });
        }
    }

    async gotoProfile() {
        await this._route('Profile', {}, [
            { type: 'DeepLink', payload: 'lekhanapp://profile' },
            { type: 'BottomNav', payload: 'Profile' }
        ]);
    }

    async gotoSettings() {
        await this._route('Settings', {}, [
            { type: 'DeepLink', payload: 'lekhanapp://settings' },
            { type: 'Drawer', payload: 'Settings' }
        ]);
    }

    async gotoAITutor() {
        await this._route('AITutor', {}, [
            { type: 'DeepLink', payload: 'lekhanapp://aitutor' },
            { type: 'BottomNav', payload: 'AITutor' }
        ]);
    }

    async gotoOCR() {
        // Assume OCR is accessed via Deep Link or Dashboard UI Flow
        await this._route('OCR', {}, [
            { type: 'DeepLink', payload: 'lekhanapp://ocr' },
            { type: 'UI', payload: null }
        ]);
    }

    async logout() {
        await this._route('Login', {}, [
            { type: 'Drawer', payload: 'Logout' }
        ]);
        this.cache.clearCache(); // Wipe cache on logout
    }

    getNavigationMetadata() {
        return this.cache.getMetadata();
    }
}

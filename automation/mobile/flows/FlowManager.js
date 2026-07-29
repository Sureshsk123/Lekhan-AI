import { FlowContext } from './FlowContext.js';
import { AuthenticationFlow } from './AuthenticationFlow.js';
import { LearningFlow } from './LearningFlow.js';
import { HardwareFlow } from './HardwareFlow.js';
import { SettingsFlow } from './SettingsFlow.js';
import { RewardFlow } from './RewardFlow.js';
import { NavigationManager } from '../utilities/NavigationManager.js';

export class FlowManager {
    /**
     * @param {object} driver - The Appium driver instance injected per test
     */
    constructor(driver) {
        this.driver = driver;
        
        // 1. Initialize Thread-Safe Context
        this.context = new FlowContext();

        // 2. Initialize Navigation Manager
        this.navManager = new NavigationManager(driver);

        // 3. Initialize Sub-Flows (Composition)
        this.authFlow = new AuthenticationFlow(driver, this.navManager, this.context);
        this.learningFlow = new LearningFlow(driver, this.navManager, this.context);
        this.hardwareFlow = new HardwareFlow(driver, this.navManager, this.context);
        this.settingsFlow = new SettingsFlow(driver, this.navManager, this.context);
        this.rewardFlow = new RewardFlow(driver, this.navManager, this.context);
    }

    // ==========================================
    // AUTHENTICATION DELEGATES
    // ==========================================
    
    async login(user) {
        await this.authFlow.login(user);
    }

    async register(user) {
        await this.authFlow.register(user);
    }

    async forgotPassword(email) {
        await this.authFlow.forgotPassword(email);
    }

    async logout() {
        await this.authFlow.logout();
    }

    // ==========================================
    // LEARNING DELEGATES
    // ==========================================

    async openLesson(name) {
        // Smart Check: If not logged in, error out or auto-login.
        // Assuming test setup logs user in, but if not:
        if (!this.context.isAuthenticated()) {
            throw new Error('User must be logged in to open a lesson');
        }
        await this.learningFlow.openLesson(name);
    }

    async completeLesson(name) {
        await this.learningFlow.completeLesson(name);
    }

    async completeLessonQuiz(name) {
        // Example of Smart Execution wrapper:
        if (!this.context.isAuthenticated()) {
            throw new Error('User must be logged in to complete a quiz');
        }
        await this.learningFlow.completeLessonQuiz(name);
    }

    async searchLesson(name) {
        await this.learningFlow.searchLesson(name);
    }

    // ==========================================
    // HARDWARE DELEGATES
    // ==========================================

    async processOCRDocument(imageSource = 'gallery') {
        await this.hardwareFlow.processOCRDocument(imageSource);
    }

    async captureImage() {
        await this.hardwareFlow.captureImage();
    }

    async selectGalleryImage() {
        await this.hardwareFlow.selectGalleryImage();
    }

    // ==========================================
    // SETTINGS DELEGATES
    // ==========================================

    async updateProfile(profileData) {
        await this.settingsFlow.updateProfile(profileData);
    }

    async changeTheme() {
        await this.settingsFlow.changeTheme();
    }

    // ==========================================
    // REWARD DELEGATES
    // ==========================================

    async purchaseReward(item) {
        await this.rewardFlow.purchaseReward(item);
    }

    async claimReward() {
        await this.rewardFlow.claimReward();
    }

    async redeemReward() {
        await this.rewardFlow.redeemReward();
    }

    // ==========================================
    // METADATA API
    // ==========================================

    getFlowMetadata() {
        return {
            context: this.context.getHistory(),
            navigation: this.navManager.getNavigationMetadata()
        };
    }
}

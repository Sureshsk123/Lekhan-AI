/**
 * NavigationCache
 * Maintains lightweight session information to optimize navigation.
 * Thread-safe: Instantiated per driver/test to avoid mutable global state.
 */
export class NavigationCache {
    constructor() {
        this.cache = {
            currentScreen: null,
            lastScreen: null,
            currentLesson: null,
            lastNavigationTime: null,
            navigationCount: 0
        };
    }

    updateCurrentScreen(screenName, metadata = {}) {
        this.cache.lastScreen = this.cache.currentScreen;
        this.cache.currentScreen = screenName;
        this.cache.lastNavigationTime = Date.now();
        this.cache.navigationCount += 1;
        
        if (metadata.lessonName) {
            this.cache.currentLesson = metadata.lessonName;
        }
    }

    getCurrentScreen() {
        return this.cache.currentScreen;
    }

    getLastScreen() {
        return this.cache.lastScreen;
    }

    isAlreadyOnScreen(screenName, metadata = {}) {
        if (this.cache.currentScreen !== screenName) {
            return false;
        }
        
        // If it's a specific lesson, verify we are on the RIGHT lesson
        if (screenName === 'LessonDetail' && metadata.lessonName) {
            return this.cache.currentLesson === metadata.lessonName;
        }

        return true;
    }

    clearCache() {
        this.cache = {
            currentScreen: null,
            lastScreen: null,
            currentLesson: null,
            lastNavigationTime: null,
            navigationCount: 0
        };
    }

    getMetadata() {
        return { ...this.cache };
    }
}

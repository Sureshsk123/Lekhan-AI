# Mobile Navigation Test Suite

This document outlines the coverage and Android-specific implementations for the Mobile Navigation Automation Suite.

## Test Coverage

The suite strictly isolates Navigation logic into four distinct files:

### 1. `BottomNavigation.test.js`
- **Tab Traversal**: Validates clicking through all primary tabs (Dashboard, Lessons, Profile, AI Tutor).
- **State Persistence**: A purely mobile-centric test. It navigates to a tab, natively backgrounds the application for 3 seconds (`driver.background(3)`), and verifies that the OS preserved the fragment state upon resuming.

### 2. `SideDrawer.test.js`
- **Icon Access**: Validates opening the Drawer via the Hamburger icon.
- **Gesture Access**: Evaluates a native `pointerMove` (swipe) gesture from the left edge of the physical screen (`X: 0`) to the right (`X: 80%`) to confirm the drawer can be opened via user swiping, rather than just clicking.
- **Routing**: Verifies that navigating from the Drawer successfully routes to Settings and Logout views.

### 3. `NavigationFlow.test.js`
*This suite tests deep stack traversal and the native hardware Back button.*
- **Deep Stacks**: Navigates `Dashboard -> Lessons -> Lesson Detail`.
- **Native Back Integration**: Natively executes `driver.back()` to simulate pressing the physical Android back button. Asserts that the OS correctly pops the top fragment and returns to the `Lessons` list, rather than exiting the app.
- **Protected Roots**: Simulates pressing the physical Back button on the root `Dashboard`. It queries the Appium state (`queryAppState`) to ensure the app doesn't unexpectedly crash (State 4 = `RUNNING_IN_FOREGROUND`).

### 4. `DeepLinkNavigation.test.js`
- **Custom URI Schemes**: Commands the Android OS to launch an intent for `lekhanapp://lesson/101`.
- **Android App Links (HTTPS)**: Commands the OS to launch an intent for `https://app.lekhan.ai/lesson/102`.
- **Validation**: Verifies that Appium can successfully intercept the app opening directly into a deeply nested `LessonDetailPage` without traversing the standard UI flow.

## Dependencies & Integrations
- **Page Object Model**: Strictly relies on POM methods.
- **`GestureUtility`**: Used implicitly via `BasePage` and explicitly for screen swiping in `SideDrawer.test.js`.
- **`LoggerUtility`**: Wired into `beforeEach` for clean execution tracing.
- **`ScreenshotUtility`**: Wired into `afterEach` for automatic failure capture.
- **`RetryUtility`**: Utilized around rotation and drawer interactions, which are notoriously prone to rendering animation delays on Emulators.

## Expected Results
When executed via `mocha tests/navigation/*.js`, all paths must resolve cleanly. The Android back stack (`driver.back()`) should behave predictably, and all Deep Link intents must land directly on their target Fragments without stalling.

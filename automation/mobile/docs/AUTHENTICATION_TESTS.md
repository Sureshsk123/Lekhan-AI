# Mobile Authentication Test Suite

This document outlines the coverage and execution flows for the Authentication phase of the Enterprise Mobile Automation Framework.

## Test Coverage

The suite strictly separates Authentication into four logical files:

### 1. `Login.test.js`
- **Positive Flows**: Valid credentials redirecting to Dashboard.
- **Negative Flows**: Empty passwords, empty usernames, invalid credentials.
- **Security Scenarios**: Validates that the system safely rejects SQL Injection (`' OR 1=1--`) and basic XSS Payloads (`<script>alert(1)</script>`).
- **Edge Cases**: Validates handling of trailing whitespace and minimum/maximum character limits.

### 2. `Register.test.js`
- **Positive Flows**: Successful user creation and auto-login transition.
- **Negative Flows**: Submitting duplicate emails, invalid email formats, and weak passwords (under 8 characters).
- **Edge Cases**: Exceeding database length boundaries for the 'Name' field.

### 3. `ForgotPassword.test.js`
- **Positive Flows**: Sending a reset link to a known valid email.
- **Negative Flows**: Attempting reset for non-existent users, empty inputs, and invalid formats.

### 4. `SessionManagement.test.js`
*This suite tests the mobile-specific lifecycle of the application.*
- **App Restarts**: Closes the application via Appium (`terminateApp`) and re-opens it (`activateApp`) to ensure the user token persists.
- **App Backgrounding**: Sends the app to the background for 5 seconds natively (`driver.background(5)`) and resumes to ensure the session hasn't crashed.
- **Screen Rotations**: Forces the Android emulator into `LANDSCAPE` mode and back to `PORTRAIT` using the `RetryUtility` to handle rotation lag.
- **Token Invalidation**: Natively clears the App Data (`clearApp`) to simulate token expiry/device wipe, ensuring the user is booted back to the Login screen.

## Dependencies & Integrations

- **Page Object Model**: Tests do not contain a single raw WebdriverIO selector. They rely entirely on `LoginPage.js`, `DashboardPage.js`, `Toast.js`, etc.
- **LoggerUtility**: Automatically injects `Starting Test...` and `Test Failed` into the Winston logs via `beforeEach` and `afterEach` hooks.
- **ScreenshotUtility**: Listens in the `afterEach` hook. If `this.currentTest.state === 'failed'`, it natively captures the emulator's screen for reporting.

## Expected Execution Flow

Assuming a standard Mocha execution:
1. `BaseTest.js` (or global hooks) boots Appium, starts the emulator, and attaches `global.driver`.
2. Mocha executes the suites in order.
3. After every single `it()` block, `global.driver.reset()` is invoked to wipe the app's state, guaranteeing test isolation and eliminating data bleeding between tests.

# Enterprise Mobile Page Object Model (POM) Guide

This document outlines the architecture, standards, and best practices for the Mobile Page Object Model implemented in this framework.

## Folder Structure
To ensure scalability across a massive enterprise application, Page Objects are strictly categorized by domain logic:

```text
automation/mobile/pages/
├── BasePage.js
├── common/             # Global states (Toasts, Loading, OS Permissions)
├── authentication/     # Auth flows (Login, Register, Splash)
├── dashboard/          # Hubs (Dashboard, Search)
├── learning/           # Core business logic (Lessons, Quizzes)
├── hardware/           # Hardware bridging (Camera, Gallery, OCR)
└── settings/           # Configurations (Profile, Settings)
```

## Reuse Strategy & Architecture
All generated Page Objects extend `BasePage.js`.

### Why?
1. **Thread Safety**: `BasePage` demands the `driver` in its constructor `super(driver)`. This guarantees that no global driver states are mutated. When running parallel Mocha instances, each Page Object encapsulates its own unique driver thread.
2. **Implicit Waiting**: Every click and text entry automatically invokes `WaitUtility.waitForDisplayed()` under the hood, eradicating flaky tests caused by slow device rendering.

## Selector Hierarchy
When assigning selectors inside a Page Object's constructor `this.selectors = {}`, strictly adhere to this fallback strategy:

1. **Accessibility ID** (`~selector_name`)
   - **Why**: Fastest to resolve natively. Cross-platform compatible if the team targets iOS later.
2. **Native Resource ID** (`id=com.app.name:id/...`)
   - **Why**: Reliable, but breaks if the Android package name changes. Required for OS-level dialogs (like Camera shutters).
3. **Content Description / UISelector** (`android=new UiSelector().description("...")`)
   - **Why**: Useful for scroll actions (`UiScrollable`), but slightly slower than exact IDs.
4. **XPath** (`//android.widget.TextView[@text="Hello"]`)
   - **Why**: Extremely brittle. Use only when the DOM structure is deeply nested and lacks all other IDs.

## Best Practices
1. **Expose Business Logic, Not Elements**:
   - ❌ **BAD**: `loginPage.enterEmail()`, `loginPage.enterPassword()`, `loginPage.clickLogin()`
   - ✅ **GOOD**: `loginPage.login(email, password)`
2. **Handle OS Dialogs via `PermissionDialog.js`**: Do not write custom wait logic in business tests for OS-level permissions. Simply inject `new PermissionDialog(driver).grantPermission()`.
3. **Use the Logger**: Every business action inside a Page Object must begin with a `logger.info()` describing the action. This ensures rich console and file reporting during execution.

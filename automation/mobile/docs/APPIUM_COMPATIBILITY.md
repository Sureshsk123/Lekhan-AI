# Enterprise Appium Compatibility Layer

The `CompatibilityManager` abstracts the core `WebdriverIO` Appium driver behind an intelligent Facade. Its primary responsibility is insulating the test suites from future Appium version deprecations and resolving OS-specific capability gaps (e.g., Android vs iOS implementations of Deep Linking or KeyEvents).

## Architecture

```text
drivers/
├── VersionDetector.js       # Extracts OS, Driver, and Appium versions from the live session
├── CapabilityDetector.js    # Determines what the driver was initialized to support
├── FeatureSupport.js        # Maps detected versions/capabilities to a feature availability matrix
├── AndroidDriverAdapter.js  # Android implementation (UiAutomator2, Espresso, ADB)
├── IOSDriverAdapter.js      # iOS implementation (XCUITest fallbacks)
└── CompatibilityManager.js  # The centralized gateway injected into tests
```

## The Fallback Cascade

Appium commands change rapidly. For example, `setNetworkConnection` is often broken on modern Android Emulators, while `mobile: deepLink` requires specific app packaging. 
The `CompatibilityManager` solves this using a Fallback Cascade.

**Example: Deep Linking on Android**
```javascript
// Test calls this simple API
await compatibilityManager.openDeepLink("lekhanapp://lesson/5");
```

*Under the hood, the `AndroidDriverAdapter` does this:*
1. **Try Modern API**: Attempts Appium 2.x standard `await driver.execute('mobile: deepLink', ...)`
2. **Catch & Fallback**: If it throws an `UnknownCommandException`, it logs a warning.
3. **Verify ADB Feature**: Checks the `FeatureSupport` matrix to ensure `adbShell` is allowed.
4. **Execute ADB Intent**: Bypasses Appium's native router and talks directly to the OS: `driver.execute('mobile: shell', { command: 'am start ...' })`.

## Migration Guide (Technical Debt)

Per the strict requirements of this phase, **existing tests and POMs were not modified**. This means that older tests (like `DeepLinkNavigation.test.js`) still rely on raw Appium calls (e.g., `driver.execute('mobile: deepLink')`).

**Future Refactoring Target:**
Any occurrence of the following APIs in the framework should be flagged and migrated to the `CompatibilityManager`:
- `driver.pressKeyCode()` -> `compatibility.pressNext()`
- `driver.setNetworkConnection()` -> `compatibility.toggleAirplaneMode()`
- `driver.background()` -> `compatibility.backgroundApp()`
- `driver.hideKeyboard()` -> `compatibility.hideKeyboard()`

## Thread Safety Guarantee
Like the rest of the enterprise framework, there are **Zero Singletons**. `CompatibilityManager` accepts the `driver` in its constructor, making it inherently safe for Mocha Parallel Workers.

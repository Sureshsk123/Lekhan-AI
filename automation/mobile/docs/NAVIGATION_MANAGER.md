# Enterprise Navigation Manager

The `NavigationManager` serves as the centralized brain for all automated routing within the Mobile Automation Framework. It eliminates brittle Page Object chaining inside tests by introducing intelligent State Caching and a fallback Navigation Strategy cascade.

## Architecture

```text
utilities/
├── NavigationCache.js       # Thread-safe in-memory state tracking
├── NavigationStrategy.js    # Strategy implementation (DeepLink, Drawer, UI)
└── NavigationManager.js     # Exposes business API and orchestrates logic
```

### Thread Safety (Parallel Execution)
To support Mocha parallel workers, the Manager and Cache are *not* singletons. They must be instantiated per-test-file (or per-worker) and injected with the local Appium `driver` instance.
```javascript
const navManager = new NavigationManager(driver);
await navManager.gotoLesson('Lesson 5');
```

## The Strategy Pattern Cascade

When a test requests a destination (e.g., `gotoSettings()`), the Manager executes the following logical flow:

1. **Cache Hit**: Checks `NavigationCache`. If `currentScreen === 'Settings'`, it performs a lightning-fast UI physical validation (is the element visible?) and returns in `<50ms`.
2. **Deep Link Strategy**: Natively commands Appium to launch `lekhanapp://settings`. This is `O(1)` routing.
3. **Bottom Nav / Drawer Strategy**: If deep linking is disabled or throws an OS error, it falls back to routing via `BottomNavigation` or `SideDrawer` Page Objects.
4. **UI Fallback Strategy**: The ultimate failsafe. Attempts to aggressively hit the native Android `Back` button until it reaches the root Dashboard, then attempts manual traversal.

## Example Usage in Tests

**Before (Brittle & Slow):**
```javascript
await bottomNav.navigateToLessons();
await lessonsPage.openLesson("Lesson 5");
```

**After (Intelligent & Fast):**
```javascript
// Will attempt lekhanapp://lesson/lesson5 first!
await navManager.gotoLesson("Lesson 5"); 
```

## Logging & Reporting
The Manager utilizes the framework's `LoggerUtility`. Every route prints its execution time and the final strategy that succeeded, providing vital metrics on whether Deep Links are functioning or if tests are surviving entirely on slow UI fallbacks.

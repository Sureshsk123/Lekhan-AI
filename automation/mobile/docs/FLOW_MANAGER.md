# Enterprise FlowManager Layer

The `FlowManager` acts as the highest level of abstraction in the Enterprise Mobile Automation Framework. It implements the Facade and Coordinator design patterns, completely shielding test authors from raw Appium commands, Page Objects, and manual navigation routing.

## Architecture

```text
flows/
├── FlowContext.js        # Thread-safe execution state (current user, active lesson, history)
├── AuthenticationFlow.js # Domain: Login, Register, Password Reset
├── LearningFlow.js       # Domain: Lessons, Quizzes, Search
├── HardwareFlow.js       # Domain: Camera, OCR, OS Permissions
├── SettingsFlow.js       # Domain: User Profiles, App Themes
├── RewardFlow.js         # Domain: Gamification mechanics
└── FlowManager.js        # The Facade: Injects dependencies and orchestrates flows
```

## How It Works

### 1. Smart Execution (The Coordinator)
Flows are self-aware. If a test requests `flowManager.completeLesson("Lesson 5")`, the framework leverages the `FlowContext` to check if a user is currently authenticated. If they are, it proceeds. If they are not, it throws an intelligent exception or automatically initiates an authentication sequence.

### 2. Error Recovery & Self-Healing
Every Flow wraps its critical sequences in `try/catch` blocks heavily integrated with `RetryUtility` and `ScreenshotUtility`. 
- **Retry**: If a screen animation lags, the `RetryUtility` will catch the missing element exception and attempt the business step again.
- **Failures**: If all retries fail, `ScreenshotUtility` natively intercepts the failure, captures the Appium emulator screen, and throws a descriptive, high-level business error (e.g., `HardwareFlow.processOCRDocument failed: ...`).

### 3. Thread Safety (No Globals)
To guarantee parallel execution readiness (e.g. running 5 devices simultaneously), the entire `FlowManager` tree relies strictly on constructor injection. There are zero `static` singletons.
```javascript
// Each Mocha worker initializes its own isolated tree
const flowManager = new FlowManager(driver);
```

## Example Usage

**Before (Manual Page Object Chaining):**
```javascript
await navigationManager.gotoLogin();
await loginPage.login('student@lekhan.ai', 'Pass123!');
await navigationManager.gotoLessons();
await lessonsPage.openLesson('Lesson 5');
await lessonDetailPage.startQuiz();
await quizPage.submitQuiz();
```

**After (Business Intent via FlowManager):**
```javascript
// The entire sequence is handled automatically, with built-in retries and screenshotting
await flowManager.login(user);
await flowManager.completeLessonQuiz('Lesson 5');
```

## Reporting Integration
By calling `flowManager.getFlowMetadata()`, future reporting hooks (like Mochawesome and ExcelJS) can extract exactly which business flows were attempted, how long they took, and which navigation strategies (Deep Links vs. Manual UI) were used to execute them!

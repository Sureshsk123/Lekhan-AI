# Enterprise Mobile UI Automation Suite

This document covers the UI Automation Suite designed to exhaustively validate reusable Android components, transient UI states, and native OS gestures (like keyboards and scroll behaviors) inside the Mobile Automation Framework.

## Test Coverage Map

The suite is located in `automation/mobile/tests/ui/` and validates:

1. **Input & Controls**: `Buttons`, `TextFields`
2. **Data Presentation**: `Cards`, `RecyclerView`, `Search`
3. **Transient Modals**: `Dialogs`, `BottomSheets`
4. **Transient Feedback**: `Toasts`, `Snackbars`, `LoadingIndicators`
5. **State Rendering**: `EmptyStates`, `ErrorStates`
6. **Native OS Mechanics**: `KeyboardBehavior`, `PullToRefresh`, `InfiniteScroll`

## Execution Architecture

This suite strictly adheres to the rule: **No Raw Selectors**.

- Tests instantiate `FlowManager` to quickly route to a specific application state (e.g. `flowManager.navManager.gotoDashboard()`).
- Tests utilize domain Page Objects to manipulate elements (e.g. `loginPage.getElement(...)`).
- If an element lacks a Page Object method (like a native Android Snackbar), tests utilize native Appium XPath or `UiAutomator` fallback logic strictly isolated to the test layer, utilizing `RetryUtility` to prevent flakiness.

## Handling Transient Android States

Transient states like Toasts and Loading Indicators are notoriously difficult to test on Emulators because they appear and disappear within milliseconds.
This suite aggressively leverages the `RetryUtility` polling mechanism (checking every 200ms-500ms) to ensure Toasts are caught before the Android OS garbage collects them.

## Handling Native Gestures (W3C Actions API)

Instead of relying on brittle generic tap commands, the suite utilizes the `W3C Actions API` injected directly through the `driver`.
This enables us to accurately simulate real human interaction:
- **Pull To Refresh**: Sweeping `pointerMove` from Y 20% to Y 80% over 1500ms.
- **Fast Fling**: Sweeping `pointerMove` over 100ms inside the RecyclerView.
- **Double Tap**: Rapid chained `pointerDown` and `pointerUp` events.

## Recovery & Screenshots

Every single UI test (`describe` block) has a global `afterEach` hook attached. If an assertion fails (e.g., "Empty state icon did not render"), the `ScreenshotUtility` natively intercepts the Mocha failure event and captures the emulator's exact visual state.

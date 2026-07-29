# Contributing Guidelines

1. **No Hardcoding**: Never write `"user123"` inside a test. Always inject `DataManager`.
2. **No Selectors in Tests**: Never write `By.id('login')` inside a test. Always use `FlowManager`.
3. **Abstract Capabilities**: Never use `driver.backgroundApp()` in a mobile test. Always use `CompatibilityManager`.
4. **Pull Requests**: Code must pass the Smoke CI gate before merge.

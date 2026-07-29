# Known Limitations

1. **Memory Exhaustion on Local Executions**: Attempting to run `workerCount=10` locally will likely crash Docker or the physical macOS machine due to the heavy RAM cost of booting 10 distinct Android Emulators simultaneously. (Cloud execution via AWS Device Farm or BrowserStack is required for high concurrency).
2. **Email Verification**: User Onboarding currently mocks email/SMS 2FA due to the lack of integration with a headless Inbox API (e.g. Mailosaur).

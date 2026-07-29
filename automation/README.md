# Lekhan AI - E2E Automation Framework

This is a production-ready Selenium E2E Automation Framework built with Node.js, Mocha, and Chai.

## Features
- **Page Object Model (POM)**: Ensures clean separation of test logic from page actions.
- **Config Driven**: Environment-specific configurations (`config/dev.json`, `config/prod.json`).
- **Utility Layer**: Helper wrappers for waits, retries, Excel reading, and screenshots.
- **Logging**: Integrated `winston` for robust logging.
- **Reporting**: `mochawesome` for HTML test execution reports.

## Setup
1. Ensure Node.js (v18+) is installed.
2. Run `npm install` inside the `automation` folder.

## Running Tests
Run tests against the dev environment:
```bash
npm run test:dev
```

Run tests against the prod environment:
```bash
npm run test:prod
```

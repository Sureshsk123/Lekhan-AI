# Local Execution Guide — Phase 7 Live E2E Testing

This guide explains how to execute the Phase 7 live Selenium and multi-domain test suites locally on your workstation.

---

## Prerequisites

- **Node.js**: v18.x or v20.x LTS installed
- **Chrome Browser**: Google Chrome installed
- **Git**: Git installed

---

## Environment Setup

1. **Install Root & Automation Dependencies**:
   ```bash
   npm ci
   cd automation
   npm ci
   cd ..
   ```

2. **Configure Target Base URL**:
   Set the `BASE_URL` environment variable to point to your live deployment URL:
   ```bash
   # macOS / Linux:
   export BASE_URL="https://<username>.github.io/<repository>/"

   # Windows (PowerShell):
   $env:BASE_URL="https://<username>.github.io/<repository>/"
   ```

---

## Running Test Suites

To launch the Phase 7 multi-domain suite (1,200 unique test cases across Selenium, Appium, Vulnerability, and Load testing):

```bash
npm run test:phase7
```

---

## Output Artifacts

Execution results will be saved in `Test Results/`:

- **Excel Reports**: `Test Results/Excel/`
  - `Automation_Test_Report.xlsx`
  - `Selenium_Testing_Report.xlsx`
  - `Appium_Testing_Report.xlsx`
  - `Vulnerability_Testing_Report.xlsx`
  - `Load_Testing_Report.xlsx`
  - `Passed_Test_Cases.xlsx`
  - `Failed_Test_Cases.xlsx`
  - `Summary_Report.xlsx`
- **HTML Dashboards**: `Test Results/HTML/`
  - `execution-report.html`
  - `dashboard.html`
  - `selenium-testing-report.html`
  - `appium-testing-report.html`
  - `vulnerability-testing-report.html`
  - `load-testing-report.html`
- **JSON & Summary**: `Test Results/JSON/execution-results.json` and `Test Results/Summary/summary.md`

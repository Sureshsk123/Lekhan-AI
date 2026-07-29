# GitHub Actions CI/CD Pipeline Architecture

This document outlines the architecture, configuration, and execution flow of the Enterprise Selenium Automation Framework's Continuous Integration/Continuous Deployment (CI/CD) pipeline.

## Overview
The CI/CD pipeline is orchestrated via GitHub Actions (`.github/workflows/selenium.yml`). It is designed to automatically trigger on code pushes, pull requests, and manually via `workflow_dispatch`. It executes the full test suite in headless parallel mode, generates comprehensive HTML and Excel reports, and securely archives all artifacts.

---

## Execution Flow

1. **Checkout Repository**: Pulls the latest code using `actions/checkout@v4`.
2. **Setup Node.js LTS**: Provisions the runner with the latest LTS version of Node.js and automatically caches `npm` dependencies to accelerate subsequent builds.
3. **Install Dependencies**: Executes a clean `npm ci` within the `automation/` working directory to ensure deterministic package resolution based on `package-lock.json`.
4. **Environment Preparation**: Installs `google-chrome-stable` and `firefox` natively onto the Ubuntu runner via `apt-get` to guarantee target browser availability.
5. **Configuration Overrides**: 
   - Dynamically modifies `config/config.json` using `jq`. 
   - For standard push/PR events, it strictly enforces `headless=true` to prevent UI rendering errors on the headless server.
   - For manual `workflow_dispatch` runs, it maps user-defined inputs (Browser, Parallel, Workers) directly into the configuration block.
6. **Application Startup**: A placeholder step intended for booting up backend APIs and frontend instances natively on the runner, utilizing `wait-on` to ensure health checks pass before executing tests.
7. **Test Execution**: Executes `npm run test`, spinning up the Mocha parallel cluster.
8. **Artifact Upload**: Securely bundles and uploads `reports/`, `logs/`, `screenshots/`, and `downloads/` to GitHub artifacts, guaranteed to execute even if the test suite fails.
9. **Job Summary Generation**: Parses the output Mochawesome JSON and injects a real-time Markdown Execution Summary directly into the `$GITHUB_STEP_SUMMARY` dashboard.
10. **Failure Handling**: Evaluates test exit codes. If tests failed, the workflow is explicitly marked as failed *after* the artifact upload completes.

---

## Execution Triggers
- **Push**: Triggers automatically on commits pushed to `main` or `master`.
- **Pull Request**: Triggers automatically on PRs targeting `main` or `master`.
- **Workflow Dispatch (Manual)**: Can be triggered via the GitHub Actions UI. Supports parameterized inputs:
  - **browser**: Target browser (chrome/firefox/edge). Default: `chrome`.
  - **headless**: Run in headless mode. Default: `true`.
  - **parallel**: Utilize Mocha parallel execution. Default: `true`.
  - **workers**: Thread allocation count. Default: `4`.

---

## Artifact Locations
Upon completion, an artifact bundle named `enterprise-automation-artifacts` is available for download on the workflow run summary page. The bundle contains:
- `reports/mochawesome.html`: Enterprise Dashboard HTML Report
- `reports/E2E_Report.xlsx`: Enterprise Data-Driven Excel Report
- `logs/`: Winston text execution logs isolated per worker
- `screenshots/`: PNG error captures grouped by browser
- `downloads/`: Any files downloaded during execution

---

## Environment Variables & Secrets Configuration

Currently, the framework runs natively without strictly requiring injected API keys. However, if your environment necessitates them (e.g., BrowserStack keys, backend URLs), map them in the YAML under the `env` block of the `Test Execution` step:

```yaml
      - name: Test Execution
        working-directory: ./automation
        env:
          NODE_ENV: prod
          API_KEY: ${{ secrets.API_KEY }}
        run: npm run test
```

You can define Secrets securely via **GitHub Repository Settings > Secrets and variables > Actions**.

---

## Browser Support
- **Chrome**: Supported natively. The workflow explicitly forces an `apt-get` installation guarantee.
- **Firefox**: Supported natively. The workflow explicitly forces an `apt-get` installation guarantee.
- **Microsoft Edge**: Requires the `edge` driver. While omitted from the explicit `apt-get` step for Ubuntu, it can be tested manually locally or via specific Edge container setups.

---

## Troubleshooting

- **Test Suite Fails but Passes Locally**: 
  - Ensure local tests are successfully passing in `headless: true` mode, as the CI strictly enforces headless operation.
  - Review the injected `mochawesome.html` and worker `.log` files in the uploaded artifacts for precise failure tracking.
- **Timeout Errors**:
  - The CI environment may be inherently slower than a local development machine. If tests consistently time out, consider increasing Mocha's timeout threshold globally inside `mocha.config.js`.
- **Mochawesome JSON Missing**:
  - If the step *Generate Job Summary* reports "Test reports not generated," this implies a fatal syntax error occurred prior to Mochawesome triggering `GlobalTeardown`. Check the CI shell output logs during the `Test Execution` step.

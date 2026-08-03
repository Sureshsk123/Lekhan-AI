# CI/CD Execution Guide — Phase 7 GitHub Actions

This guide documents the automated CI/CD deployment and live E2E testing workflow implemented in `.github/workflows/deploy-and-test.yml`.

---

## Workflow Triggers

The workflow triggers on:
- `push` to `main` or `master` branches
- `pull_request` to `main` or `master` branches
- `workflow_dispatch` (Manual trigger via GitHub Actions UI)

---

## Pipeline Stages (13 Stages)

1. **Stage 1: Repository Checkout**: Fetches repository contents using `actions/checkout@v4`.
2. **Stage 2: Dependency Installation**: Installs Node modules in root and `automation/`.
3. **Stage 3: Build Application**: Runs `npm run build` producing static output in `./dist`.
4. **Stage 4: Static Analysis**: Runs static code analysis checks (`npm run lint`).
5. **Stage 5: Deploy to GitHub Pages**: Deploys `./dist` to GitHub Pages via `actions/deploy-pages@v4`.
6. **Stage 6: Wait for Deployment**: Pauses briefly to allow GitHub Pages DNS & static server propagation.
7. **Stage 7: Deployment Verification**: Executes HTTP status checks against `BASE_URL` to confirm HTTP 200 availability.
8. **Stage 8: Run Selenium & Multi-Domain E2E Test Suite**: Executes 1,200 unique test cases (Selenium, Appium, Vulnerability, Load) against `BASE_URL`.
9. **Stage 9: Generate HTML Reports**: Builds 6 interactive HTML reports in `Test Results/HTML/`.
10. **Stage 10: Generate Excel Reports**: Writes 8 formatted Excel spreadsheets into `Test Results/Excel/`.
11. **Stage 11: Upload Artifacts**: Preserves all reports, logs, and screenshots using `actions/upload-artifact@v4` with 30 days retention.
12. **Stage 12: Publish Summary**: Posts markdown metrics to `$GITHUB_STEP_SUMMARY`.
13. **Stage 13: Store Historical Results**: Preserves historical execution JSON metrics.

---

## Required GitHub Repository Settings

1. Navigate to **Settings** -> **Pages**.
2. Source: Set to **GitHub Actions**.
3. Workflow Permissions: Ensure **Read and write permissions** are enabled under **Settings** -> **Actions** -> **General**.

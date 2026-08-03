# Troubleshooting Guide — Phase 7 CI/CD & E2E Suite

Common issues and resolution steps for Phase 7 CI/CD deployment and live E2E test execution.

---

## 1. GitHub Pages Deployment Fails (HTTP 404 / Permission Denied)

### Cause
GitHub Pages source is set to branch deployment instead of GitHub Actions, or workflow permissions are restricted.

### Solution
1. Go to **Settings** -> **Pages** in your GitHub repository.
2. Under **Build and deployment** -> **Source**, select **GitHub Actions**.
3. Go to **Settings** -> **Actions** -> **General** -> **Workflow permissions**, select **Read and write permissions**.

---

## 2. Selenium Headless Chrome Driver Failures

### Cause
Missing Chrome binary or driver version mismatch on Linux CI runner.

### Solution
Ensure `google-chrome-stable` or Chrome testing binaries are configured in the runner environment. The pipeline installs Chrome binaries automatically during Stage 2.

---

## 3. Custom Domain or Subpath BASE_URL Mismatch

### Cause
Static assets (JS/CSS) return 404 because `vite.config.js` `base` path doesn't match GitHub repository subpath.

### Solution
In `vite.config.js`, set `base: process.env.GITHUB_ACTIONS ? '/<repository-name>/' : '/'`.

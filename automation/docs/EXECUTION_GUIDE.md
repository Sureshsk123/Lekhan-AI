# Execution Guide

## Local Execution
```bash
# Run entire Hybrid Regression
PLATFORM_MODE=hybrid npm run test -- --tags=regression

# Run only Mobile Smoke
PLATFORM_MODE=mobile npm run test -- --tags=smoke
```

## CI/CD Execution
Navigate to the GitHub Actions "Actions" tab. Select the **Enterprise Unified Platform Execution** workflow. Provide the required `mode` and `environment` via the UI and click **Run Workflow**.

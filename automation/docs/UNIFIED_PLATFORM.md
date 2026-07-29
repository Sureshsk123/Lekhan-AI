# Enterprise Unified Automation Platform

## Architecture
The Orchestration layer sits at the very top of the execution pyramid. It wraps the standalone Selenium and Appium execution engines, providing a unified CLI and Programmatic API to invoke cross-platform testing simultaneously.

It does **not** override or redefine Selenium or Appium logic; it simply acts as an intelligent Dispatcher and Aggregator.

## Execution Modes
- **Web**: Triggers only the Selenium `ExecutionManager`.
- **Mobile**: Triggers only the Appium `ExecutionManager`.
- **Hybrid**: Invokes both simultaneously (Parallel mode) or in staggered order (Sequential/Dependency mode).

## The `ExecutionManifest`
The `SuiteRegistry` identifies the logical paths to the underlying suites, which are bundled into an `ExecutionManifest`. The `PlatformScheduler` consumes this manifest, mapping Web jobs to Chrome/Firefox workers, and Mobile jobs to Emulator workers.

## Unified Metrics
To provide a single pane of glass for QA engineers, the `UnifiedMetrics.js` utility waits for both the underlying `web/reports` and `mobile/reports` folders to populate. It then surgically merges these JSON objects into a single `UnifiedReport.json`, generating a combined Pass/Fail metric that CI/CD pipelines can ingest to block or approve deployments.
